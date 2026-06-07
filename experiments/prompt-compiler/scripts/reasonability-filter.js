function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function rebuildBottomSockProfile(preferredLength) {
  if (preferredLength === "full_length") {
    return {
      sockVisibility: "hidden",
      sockColor: "white",
      sockLength: "crew_socks",
      sockReason: "full-length trousers cover most of the sock, so white socks do not need emphasis",
    };
  }
  if (preferredLength === "ankle_length") {
    return {
      sockVisibility: "slightly_visible",
      sockColor: "white",
      sockLength: "crew_socks",
      sockReason: "ankle-visible trousers need a small clean white sock transition",
    };
  }
  if (preferredLength === "cropped_ankle" || preferredLength === "calf_length") {
    return {
      sockVisibility: "clearly_visible",
      sockColor: "white",
      sockLength: "mid_calf_socks",
      sockReason: "cropped or calf-visible pants need clear white socks to stabilize the lower leg",
    };
  }
  return {
    sockVisibility: "dominant_visible",
    sockColor: "white",
    sockLength: "knee_high_socks",
    sockReason: "shorts expose the lower leg, so clean white socks become part of the lower-body design",
  };
}

function setBottomLength(bottomModule, preferredLength, reason) {
  const lengthByPreference = {
    full_length: "full length",
    ankle_length: "ankle length",
    cropped_ankle: "cropped ankle",
    calf_length: "calf length",
    knee_length: "knee length",
    above_knee: "above knee",
  };
  const legExposureByPreference = {
    full_length: "covered",
    ankle_length: "ankle_visible",
    cropped_ankle: "ankle_visible",
    calf_length: "calf_visible",
    knee_length: "knee_visible",
    above_knee: "knee_visible",
  };
  bottomModule.length = lengthByPreference[preferredLength];
  bottomModule.bottomLengthPreference = {
    ...(bottomModule.bottomLengthPreference || {}),
    preferredLength,
    legExposureLevel: legExposureByPreference[preferredLength],
    lengthReason: reason,
  };
  bottomModule.sockVisibilityProfile = rebuildBottomSockProfile(preferredLength);
}

function alignBottomBaseType(bottomModule, preferredLength) {
  if (preferredLength === "full_length" && /shorts|cropped|calf-length/.test(bottomModule.baseType || "")) {
    bottomModule.baseType = "straight work trousers";
  }
  if (preferredLength === "knee_length" && !/shorts/.test(bottomModule.baseType || "")) {
    bottomModule.baseType = "knee-length shorts";
  }
  if (preferredLength === "calf_length" && bottomModule.baseType !== "calf-length utility pants") {
    bottomModule.baseType = "calf-length utility pants";
  }
  if (preferredLength === "cropped_ankle" && !/cropped|calf-length/.test(bottomModule.baseType || "")) {
    bottomModule.baseType = "cropped utility pants";
  }
}

function trimCompositionLayer(layer, warnings, fixesApplied, compressionNotes) {
  if (!layer || layer.status !== "mvp") return 0;
  let penalty = 0;
  const genericMotifs = new Set(["护符", "纸片", "门牌", "地方徽章"]);
  const control = layer.complexityControl || {};
  const elements = layer.extractedElements || {};
  const maxMainPlanes = control.maxMainPlanes || 2;
  const maxLineGroups = control.maxLineGroups || 2;
  const maxPointClusters = control.maxPointClusters || 1;

  if ((layer.sourceMotifs || []).some((motif) => genericMotifs.has(motif))) {
    warnings.push("Composition source motifs included generic fantasy or signage motifs.");
    layer.sourceMotifs = layer.sourceMotifs.filter((motif) => !genericMotifs.has(motif));
    fixesApplied.push("Removed generic motifs from composition source motifs.");
    penalty += 5;
  }

  if ((elements.planes || []).length > maxMainPlanes) {
    elements.planes = elements.planes.slice(0, maxMainPlanes);
    compressionNotes.push("Compressed composition planes to the MVP complexity budget.");
  }
  if ((elements.lines || []).length > maxLineGroups) {
    elements.lines = elements.lines.slice(0, maxLineGroups);
    compressionNotes.push("Compressed composition line groups to avoid high-frequency seam noise.");
  }
  if ((elements.points || []).length > maxPointClusters) {
    elements.points = elements.points.slice(0, maxPointClusters);
    compressionNotes.push("Compressed composition point clusters to one small accent area.");
  }

  if (control.allowDensePattern) {
    warnings.push("Composition layer allowed dense patterning.");
    control.allowDensePattern = false;
    fixesApplied.push("Disabled dense patterning in composition layer.");
    penalty += 6;
  }

  const mapping = layer.garmentMapping || {};
  const mappedAreas = [mapping.mainPanel, mapping.secondaryPanel, mapping.linePlacement, mapping.pointPlacement].filter(Boolean);
  if (new Set(mappedAreas).size > 4) {
    warnings.push("Composition mapping spread across too many garment areas.");
    mapping.secondaryPanel = "pocket flap";
    mapping.pointPlacement = "pocket tab marks";
    fixesApplied.push("Reduced composition mapping to one main garment area and one echo area.");
    penalty += 5;
  }

  if (/innerwear|white fitted|白色/.test([mapping.mainPanel, mapping.secondaryPanel].join(" "))) {
    warnings.push("Composition mapping risked covering the white fitted innerwear anchor.");
    mapping.mainPanel = "front opening panel";
    fixesApplied.push("Moved composition mapping away from white fitted innerwear.");
    penalty += 6;
  }

  layer.complexityControl = {
    ...control,
    maxMainPlanes,
    maxSecondaryPlanes: control.maxSecondaryPlanes || 2,
    maxLineGroups,
    maxPointClusters,
    allowDensePattern: false,
    motifScale: control.motifScale || "medium_to_large",
    detailDensity: control.detailDensity || "medium_low",
  };
  layer.reasonabilityNotes = [
    "Composition must behave like garment structure, not abstract sticker graphics.",
    "White fitted innerwear remains visible and readable.",
  ];
  return penalty;
}

function compositionInfluenceSummary(layer) {
  if (!layer) return null;
  return {
    sourceMotifs: (layer.sourceMotifs || []).slice(0, 2),
    garmentMapping: layer.garmentMapping || {},
    promptFragment: layer.promptFragment || "",
  };
}

function applyReasonabilityFilter(skeleton) {
  const next = clone(skeleton);
  const warnings = [];
  const fixesApplied = [];
  const rejectedCombinations = [];
  const compressionNotes = [];
  const resolved = next.influenceGenerationLayer ? next.influenceGenerationLayer.resolvedInfluences || {} : {};
  const primary = next.influenceGenerationLayer ? next.influenceGenerationLayer.primaryInfluences || {} : {};
  let score = 100;

  const climate = resolved.climateInfluence || [];
  const region = resolved.regionInfluence || primary.regionContext || "";
  if (region === "southeast_asian_rain_street" && climate.includes("snow")) {
    warnings.push("southeast_asian_rain_street should not carry snow/winter climate.");
    fixesApplied.push("Removed snow-like climate implication from rain street context.");
    score -= 8;
  }
  if (region === "harbor_district" && climate.includes("dry_desert")) {
    warnings.push("harbor_district conflicts with dry_desert climate.");
    fixesApplied.push("Kept harbor climate humid/coastal instead of dry_desert.");
    score -= 8;
  }

  if (next.outerwearModule && next.outerwearModule.presence !== "none") {
    const themeText = [primary.themeCategory, primary.occupationSeed, ...(resolved.climateInfluence || [])].join(" ");
    if (/harbor|港|rain|雨|排水|infrastructure/.test(themeText) && next.outerwearModule.baseType === "blazer") {
      warnings.push("Industrial/rain/harbor role generated formal blazer.");
      next.outerwearModule.baseType = "work jacket";
      next.outerwearModule.material = "matte nylon";
      fixesApplied.push("Changed formal blazer to work jacket with matte nylon.");
      score -= 10;
    }
    if (/library|书库/.test(themeText) && /cape|half-cape/.test(next.outerwearModule.baseType)) {
      warnings.push("Library/archive role drifted into overly fantasy cape outerwear.");
      next.outerwearModule.baseType = "long coat";
      fixesApplied.push("Changed cape-like outerwear into quiet long coat.");
      score -= 6;
    }
    next.outerwearModule.resolvedInfluences = resolved;
  }

  if (next.bottomModule && next.bottomModule.status === "active") {
    const bottom = next.bottomModule;
    const pref = bottom.bottomLengthPreference ? bottom.bottomLengthPreference.preferredLength : "full_length";
    if (["knee_length", "above_knee", "calf_length", "cropped_ankle"].includes(pref) && bottom.sockVisibilityProfile.sockVisibility === "hidden") {
      warnings.push("Exposed lower leg or ankle had hidden socks.");
      bottom.sockVisibilityProfile = rebuildBottomSockProfile(pref);
      fixesApplied.push("Made white socks visible for exposed lower leg.");
      score -= 7;
    }
    if (pref === "full_length" && bottom.sockVisibilityProfile.sockVisibility === "dominant_visible") {
      warnings.push("Full-length trousers had dominant white socks.");
      bottom.sockVisibilityProfile = rebuildBottomSockProfile("full_length");
      fixesApplied.push("Reduced socks under full-length trousers.");
      score -= 7;
    }
    if (primary.presentationMode === "ceremonial_but_practical_mode" && ["above_knee"].includes(pref)) {
      warnings.push("Ceremonial practical mode produced above-knee shorts.");
      setBottomLength(bottom, "full_length", "reasonability filter moved ceremonial mode away from above-knee shorts");
      alignBottomBaseType(bottom, "full_length");
      fixesApplied.push("Changed above-knee shorts to full-length trousers for ceremonial mode.");
      score -= 8;
    }
    if (resolved.bottomLengthBias === "full_length_preferred" && ["knee_length", "above_knee"].includes(pref)) {
      warnings.push("Full-length-preferred influence produced shorts.");
      setBottomLength(bottom, "full_length", "reasonability filter honored full_length_preferred influence");
      alignBottomBaseType(bottom, "full_length");
      fixesApplied.push("Changed shorts to full-length trousers under full_length_preferred bias.");
      score -= 6;
    }
    if (resolved.bottomLengthBias === "ankle_or_full_balanced" && ["knee_length", "above_knee"].includes(pref)) {
      warnings.push("Balanced bottom-length influence produced shorts.");
      setBottomLength(bottom, "full_length", "reasonability filter kept balanced bottom length from becoming shorts");
      alignBottomBaseType(bottom, "full_length");
      fixesApplied.push("Changed shorts to full-length trousers under balanced bottom-length bias.");
      score -= 5;
    }
    bottom.resolvedInfluences = resolved;
  }

  if (next.themeDirectionLayer && next.themeDirectionLayer.visualMotifs && next.themeDirectionLayer.visualMotifs.length > 3) {
    warnings.push("Too many must-render visual motifs.");
    next.themeDirectionLayer.visualMotifs = next.themeDirectionLayer.visualMotifs.slice(0, 2);
    fixesApplied.push("Compressed visual motifs to 1-2 core motifs.");
    score -= 4;
  } else if (next.themeDirectionLayer && next.themeDirectionLayer.visualMotifs && next.themeDirectionLayer.visualMotifs.length > 2) {
    next.themeDirectionLayer.visualMotifs = next.themeDirectionLayer.visualMotifs.slice(0, 2);
    compressionNotes.push("Compressed normal motif list to 1-2 must-render motifs without warning.");
  }

  score -= trimCompositionLayer(next.compositionLayer, warnings, fixesApplied, compressionNotes);
  const compositionInfluence = compositionInfluenceSummary(next.compositionLayer);

  if (next.topModule) next.topModule.resolvedInfluences = resolved;
  if (next.topModule) next.topModule.compositionInfluence = compositionInfluence;
  if (next.outerwearModule) next.outerwearModule.compositionInfluence = compositionInfluence;
  if (next.bottomModule) next.bottomModule.compositionInfluence = compositionInfluence;
  if (next.themeDirectionLayer) next.themeDirectionLayer.resolvedInfluences = resolved;
  if (next.fantasyLayer) {
    next.fantasyLayer.intensity = resolved.fantasyDensity || next.fantasyLayer.intensity;
    next.fantasyLayer.resolvedInfluences = resolved;
  }

  const finalDecision = score >= 80
    ? "passed with light checks"
    : score >= 65
      ? "passed after fixes"
      : "fallback recommended";

  next.reasonabilityFilter = {
    moduleName: "reasonabilityFilter",
    status: "active-mvp",
    passed: score >= 65,
    score,
    warnings,
    fixesApplied,
    compressionNotes,
    rejectedCombinations,
    finalDecision,
  };

  return next;
}

module.exports = {
  applyReasonabilityFilter,
};
