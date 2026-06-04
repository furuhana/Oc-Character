const DB_NAME = "oc-character-bible-workbench";
const DB_VERSION = 1;
const STORE_CHARACTERS = "characters";
const STORE_SETTINGS = "settings";
const CHARACTER_PLACEHOLDER = "./assets/character-placeholder.png";
const SERVER_DATA_URL = "/api/data";
const NAME_SAMPLES_URL = "/api/name-samples";

function makeId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  const values = new Uint32Array(4);
  if (globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(values);
  } else {
    values.set(Array.from({ length: 4 }, () => Math.floor(Math.random() * 0xffffffff)));
  }
  return Array.from(values, (value) => value.toString(16).padStart(8, "0")).join("-");
}

const starterPositiveDefault = [
  "\u91cd\u70b9\u65b9\u5411\uff1a\u90fd\u5e02\u4e3a\u4e3b\uff0c\u5947\u5e7b\u4e3a\u8f85",
  "\u4f53\u578b\u4e0b\u9650\uff1a\u975e\u5e38\u58ee\u3001\u975e\u5e38\u539a\u5b9e\u3001\u808c\u8089\u91cf\u5f88\u5927\u7684\u6210\u5e74\u7537\u6027\uff0c\u4e0d\u8981\u53ea\u662f\u666e\u901a\u8fd0\u52a8\u578b",
  "\u6781\u5bbd\u80a9\u3001\u539a\u80f8\u3001\u7c97\u8116\u548c\u659c\u65b9\u808c\u3001\u5927\u4e0a\u81c2\u3001\u7c97\u524d\u81c2\u3001\u5f3a\u58ee\u5927\u817f\uff0c\u5706\u6da6\u4f46\u6709\u538b\u91cd\u529b\u91cf",
  "\u5982\u679c\u7528\u6237\u8981\u66f4\u58ee\uff0c\u8981\u5199\u6210\u6bd4\u53c2\u8003\u56fe\u66f4\u5927\u3001\u66f4\u539a\u3001\u66f4\u6709\u529b\u91cf\u7684\u5de8\u578b\u529b\u91cf\u611f\u4f53\u683c",
  "\u751f\u6210\u670d\u88c5\u524d\u5148\u8bfb COSTUME_DESIGN_GUIDE.md\uff0c\u7528\u670d\u88c5\u8bbe\u8ba1\u95e8\u69db\u5224\u65ad\u7a7f\u642d",
  "\u767d\u8272\u8d34\u8eab\u4e0a\u8863\u662f\u6838\u5fc3\u504f\u597d\uff1a\u7d27\u8eabT-shirt\u3001\u80cc\u5fc3\u3001\u957f\u8896\u6216\u5176\u4ed6\u53ef\u624e\u8fdb\u8170\u90e8\u7ed3\u6784\u7684\u7d27\u8eab\u767d\u8272\u4e0a\u8863\uff0c\u8981\u8bfb\u51fa\u80f8\u80a9\u548c\u624b\u81c2\u4f53\u79ef",
  "\u5982\u679c\u7528\u6237\u8bf4\u8131\u6389\u5916\u5957\uff0c\u5c31\u4e0d\u8981\u518d\u8865\u56de\u5939\u514b\u3001\u5916\u5957\u3001\u80cc\u5fc3\u3001\u5f00\u895f\u886c\u886b\u6216\u5176\u4ed6\u4e0a\u8eab\u5916\u5c42",
  "\u73b0\u5b9e\u804c\u4e1a\u6216\u793e\u4f1a\u89d2\u8272\u4f5c\u4e3a\u57fa\u5e95",
  "\u4e00\u4e2a\u6e05\u6670\u7684\u6838\u5fc3\u8bbe\u8ba1\uff1a\u62db\u724c\u88c5\u5907\u3001\u5f02\u80fd\u3001\u9b54\u6cd5\u9053\u5177\u6216\u9690\u85cf\u8eab\u4efd",
  "\u73b0\u4ee3\u670d\u88c5\u4e0e\u8f7b\u91cf\u5947\u5e7b\u7ec6\u8282\u7ed3\u5408\uff0c\u670d\u88c5\u5fc5\u987b\u597d\u770b\u800c\u4e0d\u53ea\u662f\u5b9e\u7528",
  "\u7528\u6570\u503c\u3001\u4e16\u754c\u9635\u8425\u3001\u6218\u6597\u65b9\u5f0f\u3001\u8eab\u4f53\u8f6e\u5ed3\u548c\u53cd\u91cd\u590d\u4ea4\u6362\u6765\u51b3\u5b9a\u670d\u88c5",
  "\u4eac\u90fd\u52a8\u753b\u5f0f\u6e05\u723d\u7ebf\u6761",
  "\u5e72\u51c0\u8d5b\u7490\u7490\u9634\u5f71\uff0c\u9634\u5f71\u6982\u62ec\u660e\u786e",
  "\u6574\u4f53\u5e72\u51c0\u3001\u65e0\u7070\u5c18\u3001\u4e3b\u52a8\u964d\u566a",
  "\u989c\u8272\u6e05\u900f\uff0c\u89d2\u8272\u8f6e\u5ed3\u6613\u8bfb",
].join("\n");

const starterNegativeDefault = [
  "\u5c11\u5973",
  "\u841d\u8389",
  "\u840c\u7cfb",
  "\u5076\u50cf\u98ce\u3001\u5973\u6027\u5316\u7537\u6027",
  "\u7626\u5f31\u4f53\u578b",
  "\u666e\u901a\u8fd0\u52a8\u578b\u4f53\u683c",
  "\u4fee\u957f\u7ea4\u7ec6\u7537\u4e3b",
  "\u5199\u5b9e\u808c\u8089\u6e32\u67d3",
  "\u5199\u5b9e\u5e03\u6599\u7eb9\u7406\u3001\u5199\u5b9e\u6750\u8d28\u53cd\u5149\u3001\u65f6\u88c5\u6444\u5f71\u8bed\u8a00",
  "\u6cb9\u4eae\u76ae\u9769\u3001\u6e7f\u8eab\u6750\u8d28\u3001\u62df\u771f\u5851\u6599\u6216\u4e73\u80f6\u611f",
  "\u5de5\u4e1a\u98ce\u4f5c\u4e3a\u4e3b\u8bbe\u8ba1",
  "\u5927\u91cf\u7070\u5c18\u3001\u6cb9\u6c61\u3001\u94c1\u9508\u3001\u810f\u6c61\u8d28\u611f",
  "\u5e9f\u571f\u3001\u7164\u7070\u3001\u6df7\u6d4a\u9634\u5f71",
].join("\n");

const starterPromptDefault = composeStarterPrompt(starterPositiveDefault, starterNegativeDefault);

const generationNotesDefault = [
  "\u3010\u751f\u56fe\u8bfb\u53d6\u89c4\u5219\u3011",
  "\u5168\u8eab\u56fe\u751f\u6210\u65f6\uff0c\u53ea\u8bfb\u53d6\u3010\u63d0\u793a\u8bcd\u3011\u6a21\u5757\u91cc\u7684\u6700\u7ec8\u63d0\u793a\u8bcd\u548c\u5df2\u4e0a\u4f20\u7684\u98ce\u683c\u53c2\u8003\u56fe\u3002",
  "\u4e0d\u76f4\u63a5\u8bfb\u53d6\u8eab\u4efd\u3001\u7279\u5f81\u3001\u670d\u88c5\u3001\u4eba\u683c\u3001\u6570\u503c\u7b49\u96f6\u6563\u5b57\u6bb5\u3002",
  "\u8fd9\u4e9b\u5b57\u6bb5\u53ea\u7528\u4e8e\u5148\u751f\u6210\u6700\u7ec8\u63d0\u793a\u8bcd\uff0c\u4e0d\u4f1a\u518d\u88ab\u8ffd\u52a0\u5230\u751f\u56fe\u63d0\u793a\u91cc\u3002",
  "",
  "1. \u6700\u7ec8\u63d0\u793a\u8bcd",
  "- \u5fc5\u987b\u660e\u786e\u5199\u6210\uff1a\u5355\u4e2a\u4eba\u7269\u3001\u5168\u8eab\u7acb\u7ed8\u3001\u5934\u5230\u811a\u5b8c\u6574\u53ef\u89c1\u3002",
  "- \u8981\u628a\u89d2\u8272\u7684\u8eab\u4efd\u3001\u8eab\u5f62\u3001\u8138\u90e8\u3001\u53d1\u578b\u3001\u670d\u88c5\u3001\u5de5\u5177\u6216\u6b66\u5668\u8f6c\u6210\u53ef\u89c6\u5316\u63cf\u8ff0\u3002",
  "- \u9ed8\u8ba4\u5199\u6210\u73b0\u4ee3\u90fd\u5e02\u89d2\u8272\uff0c\u7528\u4e00\u4e2a\u62db\u724c\u88c5\u5907\u3001\u5f02\u80fd\u3001\u9b54\u6cd5\u9053\u5177\u6216\u9690\u85cf\u8eab\u4efd\u505a\u6838\u5fc3\u8bbe\u8ba1\u94a9\u5b50\u3002",
  "- 武器生成必须先决定战斗原型，再决定武器来源，最后才读取职业元素进行包装；禁止直接把职业常见工具当成最终武器。",
  "- 如果职业暗示了扳手、菜刀、书本、手术刀等直译工具，先写入禁用直译，再通过结构、尺度、功能、媒介或伪装至少变形一次。",
  "- 战斗字段填写顺序：战斗原型 -> 武器来源 -> 禁用直译 -> 变形逻辑 -> 最终武器。",
  "- \u9ed8\u8ba4\u4f53\u578b\u4e0b\u9650\u662f\u975e\u5e38\u58ee\u3001\u975e\u5e38\u539a\u5b9e\u3001\u808c\u8089\u91cf\u5f88\u5927\u7684\u6210\u5e74\u7537\u6027\uff1a\u6781\u5bbd\u80a9\u3001\u539a\u80f8\u3001\u7c97\u8116\u659c\u65b9\u808c\u3001\u5927\u4e0a\u81c2\u3001\u7c97\u524d\u81c2\u548c\u5f3a\u58ee\u5927\u817f\uff0c\u4e0d\u662f\u4fee\u957f\u7626\u7537\u4e3b\uff0c\u4e5f\u4e0d\u662f\u666e\u901a\u8fd0\u52a8\u578b\u3002",
  "- \u5199\u670d\u88c5\u5b57\u6bb5\u524d\u5fc5\u987b\u5148\u8bfb COSTUME_DESIGN_GUIDE.md\uff0c\u7528\u670d\u88c5\u8bbe\u8ba1\u95e8\u69db\u5224\u65ad\u7a7f\u642d\uff0c\u4e0d\u628a\u5b83\u5f53\u6210\u56fa\u5b9a\u670d\u88c5\u5e93\u3002",
  "- \u767d\u8272\u8d34\u8eab\u4e0a\u8863\u662f\u6838\u5fc3\u504f\u597d\uff1a\u7d27\u8eabT-shirt\u3001\u80cc\u5fc3\u3001\u957f\u8896\u6216\u5176\u4ed6\u53ef\u624e\u8fdb\u8170\u90e8\u7ed3\u6784\u7684\u7d27\u8eab\u767d\u8272\u4e0a\u8863\uff1b\u8981\u7528\u5e72\u51c0\u8d5b\u7490\u7490\u9634\u5f71\u8bfb\u51fa\u80f8\u80a9\u624b\u81c2\u4f53\u79ef\uff0c\u4e0d\u8981\u6e7f\u8eab\u6216\u5199\u5b9e\u808c\u8089\u3002",
  "- \u5982\u679c\u7528\u6237\u8bf4\u8131\u6389\u5916\u5957\uff0c\u6700\u7ec8\u63d0\u793a\u8bcd\u8981\u660e\u786e\u7981\u6b62 jacket/coat/vest/open shirt/overshirt\uff0c\u8ba9\u7d27\u8eab\u767d\u8272\u4e0a\u8863\u6210\u4e3a\u4e0a\u8eab\u4e3b\u89c6\u89c9\u3002",
  "- \u6750\u8d28\u7528\u5e72\u51c0\u52a8\u753b\u8bbe\u8ba1\u8bed\u8a00\uff1a\u5e73\u9762\u8272\u5757\u3001\u6982\u62ec\u8936\u76b1\u3001\u7b80\u5316\u91d1\u5c5e\u5c0f\u70b9\u7f00\uff1b\u4e0d\u8981\u5199\u5b9e\u5e03\u6599\u7eb9\u7406\u3001\u6cb9\u4eae\u53cd\u5149\u6216\u65f6\u88c5\u6444\u5f71\u8bed\u8a00\u3002",
  "- \u753b\u98ce\u8981\u660e\u786e\u5199\u6210\u4eac\u90fd\u52a8\u753b\u5f0f\u6e05\u723d TV \u52a8\u753b\u8d5b\u7490\u7490\uff1a\u7ebf\u6761\u5e72\u51c0\u6d41\u7545\uff0c\u9634\u5f71\u5757\u9762\u6982\u62ec\uff0c\u6574\u4f53\u5e72\u51c0\u65e0\u7070\u5c18\u3002",
  "- \u82f1\u6587\u63d0\u793a\u8bcd\u4f5c\u4e3a\u751f\u56fe\u4e3b\u6587\u672c\uff0c\u4e2d\u6587\u4f5c\u4e3a\u7406\u89e3\u5907\u4efd\u3002",
  "- \u6700\u7ec8\u63d0\u793a\u8bcd\u4e0d\u8981\u5199\u89d2\u8272\u540d\u5b57\u3001\u4ee3\u53f7\u3001\u522b\u540d\u6216\u7f57\u9a6c\u97f3\uff1b\u7528\u5e74\u9f84\u3001\u8840\u7edf\u3001\u804c\u4e1a\u3001\u4f53\u578b\u3001\u8138\u3001\u670d\u88c5\u3001\u9053\u5177\u548c\u5947\u5e7b\u6807\u8bb0\u63cf\u8ff0\u53ef\u89c6\u5185\u5bb9\u3002",
  "",
  "2. \u98ce\u683c\u53c2\u8003\u56fe",
  "- \u53ea\u53c2\u8003\u4f53\u578b\u6bd4\u4f8b\u3001\u7ebf\u6761\u3001\u4e0a\u8272\u548c\u753b\u98ce\u3002",
  "- \u4e0d\u590d\u5236\u53c2\u8003\u56fe\u7684\u89d2\u8272\u8eab\u4efd\u3001\u8138\u3001\u8863\u670d\u3001\u9053\u5177\u3001\u59ff\u52bf\u548c\u914d\u8272\u3002",
  "",
  "3. \u7981\u6b62\u5185\u5bb9",
  "- \u4e0d\u8981 UI\u3001\u4fe1\u606f\u56fe\u3001\u56fe\u8868\u3001\u8bbe\u5b9a\u8868\u3001\u6587\u5b57\u6807\u7b7e\u3001\u9875\u9762\u622a\u56fe\u3001\u591a\u4eba\u7ec4\u56fe\u3002",
  "- \u4e0d\u8981\u628a\u751f\u6210\u914d\u7f6e\u6216\u5c5e\u6027\u5217\u8868\u505a\u6210\u753b\u9762\u5185\u5bb9\u3002",
  "- \u4e0d\u8981\u628a\u5de5\u4e1a\u611f\u3001\u810f\u6c61\u3001\u7070\u5c18\u3001\u6cb9\u6c61\u3001\u94c1\u9508\u6216\u5e9f\u571f\u7eb9\u7406\u5f53\u6210\u4e3b\u8981\u8bbe\u8ba1\u4e3b\u5f20\u3002",
].join("\n");

const presetDefaults = [
  { id: makeId(), name: "Urban Fantasy", content: "\u90fd\u5e02\u4e3a\u4e3b\n\u73b0\u5b9e\u804c\u4e1a\n\u8f7b\u91cf\u5947\u5e7b\n\u6838\u5fc3\u9053\u5177\u6216\u5f02\u80fd" },
  { id: makeId(), name: "Clean Anime", content: "\u4eac\u90fd\u52a8\u753b\u503e\u5411\n\u5e72\u51c0\u7ebf\u6761\n\u6982\u62ec\u9634\u5f71\n\u65e0\u7070\u5c18" },
  { id: makeId(), name: "Huge Strong Male", content: "\u975e\u5e38\u58ee\u3001\u975e\u5e38\u539a\u5b9e\n\u6781\u5bbd\u80a9\u539a\u80f8\n\u5927\u4e0a\u81c2\u548c\u7c97\u524d\u81c2\n\u7d27\u8eab\u767d\u8272\u4e0a\u8863\u4f53\u7cfb" },
  { id: makeId(), name: "Signature Gear", content: "\u62db\u724c\u88c5\u5907\n\u53ef\u8bc6\u522b\u8f6e\u5ed3\n\u73b0\u4ee3\u670d\u88c5\n\u4e00\u4e2a\u8bb0\u5fc6\u70b9" },
  { id: makeId(), name: "Hidden Magic", content: "\u65e5\u5e38\u8eab\u4efd\n\u9690\u85cf\u9b54\u6cd5\n\u4f4e\u5947\u5e7b\u5bc6\u5ea6\n\u5e72\u51c0\u90fd\u5e02\u611f" },
];

const battleArchetypeTranslations = {
  "Guardian Responder": "\u5b88\u62a4\u578b\u54cd\u5e94\u8005",
  "Guardian Route Setter": "\u5b88\u62a4\u578b\u8def\u7ebf\u89c4\u5212\u8005",
  "Guardian Archivist": "\u5b88\u62a4\u578b\u6863\u6848\u7ba1\u7406\u8005",
  "Guardian Civic Mediator": "\u5b88\u62a4\u578b\u57ce\u5e02\u8c03\u505c\u8005",
  "Guardian Transit Warden": "\u5b88\u62a4\u578b\u4ea4\u901a\u7ba1\u5236\u8005",
  "Guardian Courier": "\u5b88\u62a4\u578b\u9012\u9001\u8005",
};

let db;
let characters = [];
let nameSamples = { cultures: {} };
let currentId = null;
let currentAsset = "fullBody";
let currentProfileModule = "identity";
let currentSampleCulture = "japanese";
let currentSampleCategory = "realSurnames";
let profileModulePinned = false;
let serverPersistenceAvailable = false;
let settings = {
  starterPrompt: starterPromptDefault,
  styleReference: {
    image: "",
    fileName: "",
  },
  presets: presetDefaults,
  developer: {
    uploadX: 0,
    uploadY: 0,
    deleteX: 0,
    deleteY: 0,
    heroTextX: 0,
    heroTextY: 0,
    heroTextWidth: 660,
    heroNameLimit: 16,
    heroFactionLimit: 16,
    characterScale: 100,
    characterX: 50,
    characterY: 28,
    barcodeX: 0,
    barcodeY: 0,
    barcodeScale: 100,
    dossierX: 0,
    dossierY: 0,
    listNameLimit: 82,
    listFactionLimit: 36,
    listTextWidth: 177,
    searchIconX: 0,
    searchIconY: 0,
    cjkUnit: 4,
    latinUnit: 1.5,
    ellipsisUnit: 4.9,
    panelLeft: null,
    panelTop: null,
  },
};
let saveTimer = null;

const els = {
  list: document.querySelector("#characterList"),
  search: document.querySelector("#searchInput"),
  newCharacter: document.querySelector("#newCharacterBtn"),
  heroName: document.querySelector("#heroName"),
  heroFaction: document.querySelector("#heroFaction"),
  centerPanel: document.querySelector(".center-panel"),
  profilePanel: document.querySelector(".profile-panel"),
  form: document.querySelector("#profileForm"),
  profileModuleSwitch: document.querySelector("#profileModuleSwitch"),
  profileScrollbar: document.querySelector(".profile-scrollbar"),
  profileSectionHead: document.querySelector(".section-head"),
  profileSectionTitle: document.querySelector(".section-head span:first-child"),
  profileSectionTitleEn: document.querySelector("#profileSectionTitleEn"),
  savedAt: document.querySelector("#savedAt"),
  characterImage: document.querySelector("#characterImage"),
  imageUpload: document.querySelector("#imageUpload"),
  clearImage: document.querySelector("#clearImageBtn"),
  assetTabs: document.querySelector("#assetTabs"),
  attributeMark: document.querySelector("#attributeMarkBtn"),
  imageMark: document.querySelector("#imageMarkBtn"),
  markSummary: document.querySelector("#markSummary"),
  agentLamp: document.querySelector("#agentLamp"),
  agentRow: document.querySelector(".agent-row"),
  dialog: document.querySelector("#generationDialog"),
  profileOpen: document.querySelector("#profileOpenBtn"),
  dialogTabs: document.querySelectorAll(".dialog-tab"),
  dialogPages: document.querySelectorAll(".profile-tab-page"),
  starterPrompt: document.querySelector("#starterPrompt"),
  starterPositivePrompt: document.querySelector("#starterPositivePrompt"),
  starterNegativePrompt: document.querySelector("#starterNegativePrompt"),
  styleReferenceInput: document.querySelector("#styleReferenceInput"),
  styleReferencePreview: document.querySelector("#styleReferencePreview"),
  styleReferenceName: document.querySelector("#styleReferenceName"),
  styleReferenceClear: document.querySelector("#styleReferenceClearBtn"),
  generationNotes: document.querySelector("#generationNotes"),
  presetName: document.querySelector("#presetName"),
  presetContent: document.querySelector("#presetContent"),
  savePreset: document.querySelector("#savePresetBtn"),
  presetList: document.querySelector("#presetList"),
  export: document.querySelector("#exportBtn"),
  import: document.querySelector("#importInput"),
  devOpen: document.querySelector("#devOpenBtn"),
  devPanel: document.querySelector("#devPanel"),
  devDragHandle: document.querySelector("#devDragHandle"),
  devClose: document.querySelector("#devCloseBtn"),
  devReset: document.querySelector("#devResetBtn"),
  devControls: document.querySelectorAll("[data-dev]"),
  devValues: document.querySelectorAll("[data-dev-value]"),
  sampleDialog: document.querySelector("#sampleLibraryDialog"),
  sampleCultureTabs: document.querySelector("#sampleCultureTabs"),
  sampleCategoryTabs: document.querySelector("#sampleCategoryTabs"),
  sampleTextarea: document.querySelector("#sampleLibraryTextarea"),
  sampleStatus: document.querySelector("#sampleLibraryStatus"),
  sampleSave: document.querySelector("#sampleLibrarySaveBtn"),
  sampleDedupe: document.querySelector("#sampleLibraryDedupeBtn"),
};

const sampleCategoryLabels = {
  realSurnames: "\u5b9e\u59d3",
  surname1: "\u59d31",
  surname2: "\u59d32",
  given1: "\u540d1",
  connectors: "\u8fde\u63a5",
  suffixes: "\u5c3e",
  concepts: "\u6982\u5ff5\u8bcd",
  anomalySuffixes: "\u5f02\u5e38\u540e\u7f00",
};

const sampleCultureFallbacks = {
  japanese: "\u65e5\u672c",
  chinese: "\u4e2d\u56fd",
  american: "\u7f8e\u56fd",
  mixed: "\u6df7\u8840",
};

const developerDefaults = { ...settings.developer };
const fixedDeveloperSettings = {
  listNameLimit: 82,
  listFactionLimit: 36,
  searchIconX: 0,
  searchIconY: 0,
  cjkUnit: 4,
  latinUnit: 1.5,
  ellipsisUnit: 4.9,
};

function normalizeSettings(raw = {}) {
  const merged = { ...settings, ...raw };
  merged.styleReference = {
    image: raw.styleReference?.image || "",
    fileName: raw.styleReference?.fileName || "",
  };
  merged.developer = migrateDeveloperSettings(raw.developer || merged.developer);
  return merged;
}

function normalizeNameSamples(raw = {}) {
  const cultures = raw.cultures && typeof raw.cultures === "object" ? raw.cultures : {};
  for (const [cultureKey, culture] of Object.entries(cultures)) {
    culture.label ||= sampleCultureFallbacks[cultureKey] || cultureKey;
    culture.categories ||= {};
    for (const categoryKey of Object.keys(sampleCategoryLabels)) {
      const value = culture.categories[categoryKey];
      culture.categories[categoryKey] = Array.isArray(value) ? dedupeTokens(value) : [];
    }
  }
  return { cultures };
}

function dedupeTokens(tokens) {
  const seen = new Set();
  const cleaned = [];
  for (const token of tokens || []) {
    const value = String(token || "").trim();
    if (!value || seen.has(value)) continue;
    seen.add(value);
    cleaned.push(value);
  }
  return cleaned;
}

function splitSampleText(text) {
  return dedupeTokens(String(text || "").split(/[\s,，、;；]+/u));
}

const numericalAttributeDefaults = {
  wealth: 30,
  morality: 30,
  sanity: 30,
  confidence: 30,
  stress: 30,
  danger: 30,
  desire: 30,
  loyalty: 30,
  stability: 30,
  social: 30,
  doom: 30,
  violence: 30,
  imagination: 30,
  worldBinding: 30,
  identityMix: 30,
  nameRealism: 70,
};

const profileModules = {
  identity: { title: "\u6838\u5fc3\u8eab\u4efd", titleEn: "CORE PROFILE" },
  appearance: { title: "\u957f\u76f8\u7279\u5f81", titleEn: "VISUAL IDENTITY" },
  personality: { title: "\u4eba\u683c", titleEn: "PERSONALITY" },
  behavior: { title: "\u884c\u4e3a", titleEn: "BEHAVIOR" },
  costume: { title: "\u670d\u88c5", titleEn: "COSTUME" },
  life: { title: "\u751f\u6d3b", titleEn: "LIFESTYLE" },
  social: { title: "\u793e\u4ea4", titleEn: "SOCIAL" },
  combat: { title: "\u6218\u6597", titleEn: "COMBAT" },
  world: { title: "\u4e0e\u4e16\u754c", titleEn: "WORLD RELATION" },
  unlock: { title: "\u89e3\u9501\u9879", titleEn: "UNLOCKS" },
  stats: { title: "\u6570\u503c", titleEn: "STATS" },
  prompt: { title: "\u6700\u7ec8\u63d0\u793a\u8bcd", titleEn: "FINAL PROMPT" },
};

const identityProfileTemplate = `
  <div class="profile-category-list identity-category-list">
    <section class="profile-category-section">
      ${renderProfileCategoryHeader("BASIC")}
      <div class="profile-category-fields identity-fields">
        <label class="span-2">&#21517;&#23383; / NAME<input data-field="coreIdentity.name" /></label>
        <label class="span-2">&#20195;&#21495; / CODENAME<input data-field="coreIdentity.codename" /></label>
        <label>&#29983;&#26085; / B<input data-field="coreIdentity.birthday" /></label>
        <label>&#24180;&#40836; / A<input data-field="coreIdentity.age" /></label>
        <label>&#36523;&#39640; / H<input data-field="coreIdentity.height" /></label>
        <label>&#20307;&#37325; / W<input data-field="coreIdentity.weight" /></label>
        <label class="span-2">&#32844;&#19994; / OCCUPATION<input data-field="coreIdentity.occupation" /></label>
        <label class="span-2">&#32452;&#32455; / AFFILIATION<input data-field="coreIdentity.affiliation" /></label>
        <label class="span-2">&#31181;&#26063; / SPECIES<input data-field="coreIdentity.species" /></label>
        <label class="span-2">&#22269;&#31821;&#34880;&#32479; / HERITAGE<input data-field="coreIdentity.heritage" /></label>
        <label class="span-4">&#24615;&#26684; / CORE PERSONALITY<input data-field="personality.corePersonality" /></label>
        <label class="span-4 textarea-field">&#29305;&#28857; / VISUAL KEYWORDS<textarea data-field="visualIdentity.visualKeywords"></textarea></label>
        <label class="span-4 textarea-field">&#38057;&#23376; / CHARACTER HOOK<textarea data-field="metaDesign.characterHook"></textarea></label>
      </div>
    </section>
  </div>
`;

const profileModuleFields = {
  appearance: [
    {
      title: "FACE",
      fields: [
        ["\u8138\u578b", "FACE", "visualIdentity.faceShape"],
        ["\u8868\u60c5", "EXPRESSION", "visualIdentity.expression", "span-4"],
        ["\u773c\u578b", "EYES", "visualIdentity.eyes"],
        ["\u77b3\u8272", "EYE CLR", "visualIdentity.eyeColor"],
        ["\u7709\u6bdb", "EYEBROW", "visualIdentity.eyebrow"],
        ["\u5634\u578b", "LIP", "visualIdentity.lip"],
        ["\u75a4\u75d5", "SCAR", "visualIdentity.scar", "span-4"],
        ["\u7eb9\u8eab", "TATTOO", "visualIdentity.tattoo", "span-4"],
      ],
    },
    {
      title: "HAIR",
      fields: [
        ["\u53d1\u578b", "STYLE", "visualIdentity.hairStyle", "span-4"],
        ["\u53d1\u957f", "LENGTH", "visualIdentity.hairLength", "span-4"],
        ["\u53d1\u8272", "COLOR", "visualIdentity.hairColor"],
        ["\u6311\u67d3", "HIGHLIGHT", "visualIdentity.highlight"],
        ["\u80e1\u5b50", "FACIAL", "visualIdentity.facialHair"],
      ],
    },
    {
      title: "BODY",
      fields: [
        ["\u4f53\u578b", "BUILD", "visualIdentity.bodyType"],
        ["\u808c\u8089\u91cf", "MUSCLE", "visualIdentity.muscleLevel"],
        ["\u4f53\u8102", "BODY FAT", "visualIdentity.bodyFat"],
        ["\u80a9\u5bbd", "SHOULDER", "visualIdentity.shoulderWidth"],
        ["\u80a4\u8272", "SKIN TONE", "visualIdentity.skinTone", "span-4"],
        ["\u808c\u8089\u7126\u70b9", "FOCUS", "visualIdentity.muscleFocus", "span-4"],
      ],
    },
  ],
  costume: [
    {
      title: "UPPER BODY",
      fields: [
        ["\u5916\u5957", "OUTERWEAR", "costumeSystem.outerwear"],
        ["\u5916\u5957\u989c\u8272", "COAT CLR", "costumeSystem.outerwearColor"],
        ["\u6253\u5e95", "INNERWEAR", "costumeSystem.innerwear"],
        ["\u6253\u5e95\u989c\u8272", "INNER CLR", "costumeSystem.innerwearColor"],
      ],
    },
    {
      title: "LOWER BODY",
      fields: [
        ["\u88e4\u5b50", "PANTS", "costumeSystem.pants"],
        ["\u88e4\u5b50\u989c\u8272", "PANTS COLOR", "costumeSystem.pantsColor"],
        ["\u889c\u5b50", "SOCKS", "costumeSystem.socks"],
        ["\u889c\u5b50\u989c\u8272", "SOCKS COLOR", "costumeSystem.socksColor"],
        ["\u978b\u5b50", "SHOES", "costumeSystem.shoes"],
        ["\u978b\u5b50\u989c\u8272", "SHOES COLOR", "costumeSystem.shoesColor"],
      ],
    },
    {
      title: "ACCESSORIES",
      fields: [
        ["\u624b\u5957", "GLOVES", "costumeSystem.gloves"],
        ["\u624b\u5957\u989c\u8272", "GLOVES COLOR", "costumeSystem.glovesColor"],
        ["\u9879\u94fe", "NECKLACE", "costumeSystem.necklace"],
        ["\u9879\u94fe\u989c\u8272", "NECKLACE COLOR", "costumeSystem.necklaceColor"],
        ["\u8170\u5e26", "BELT", "costumeSystem.belt"],
        ["\u8170\u5e26\u989c\u8272", "BELT COLOR", "costumeSystem.beltColor"],
        ["\u6807\u5fd7\u7269", "SIGNATURE", "costumeSystem.signatureItem"],
        ["\u6807\u5fd7\u7269\u989c\u8272", "SIGN CLR", "costumeSystem.signatureItemColor"],
      ],
    },
  ],
  personality: [
    {
      title: "PERSONALITY TRAITS",
      fields: [
        ["\u6838\u5fc3\u6027\u683c", "CORE", "personality.corePersonality"],
        ["\u4f18\u70b9", "STRENGTHS", "personality.strengths"],
        ["\u7f3a\u70b9", "WEAKNESSES", "personality.weaknesses"],
        ["\u9690\u85cf\u6027\u683c", "HIDDEN", "personality.hiddenPersonality"],
        ["\u60c5\u7eea\u7a33\u5b9a", "STABILITY", "personality.emotionalStability"],
        ["\u81ea\u4fe1\u7a0b\u5ea6", "CONFIDENCE", "personality.confidenceLevel"],
      ],
    },
    {
      title: "CONTRADICTIONS",
      fields: [
        ["\u5916\u5728\u8868\u73b0", "PERSONA", "personality.outwardPersona", "span-4"],
        ["\u771f\u5b9e\u5185\u6838", "TRUE CORE", "personality.trueCore", "span-4"],
      ],
    },
    {
      title: "FEARS",
      fields: [
        ["\u8868\u5c42\u6050\u60e7", "SURFACE", "personality.surfaceFear", "span-4"],
        ["\u6df1\u5c42\u6050\u60e7", "DEEP", "personality.deepFear", "span-4"],
        ["\u521b\u4f24\u89e6\u53d1", "TRIGGER", "personality.traumaTrigger", "span-4"],
        ["\u5e94\u6fc0\u53cd\u5e94", "STRESS", "personality.stressResponse", "span-4"],
      ],
    },
    {
      title: "TRAUMA",
      fields: [
        ["\u521b\u4f24", "TRAUMA", "personality.trauma", "span-4"],
        ["\u521b\u4f24\u6765\u6e90", "SOURCE", "personality.traumaSource", "span-4"],
        ["\u6062\u590d\u72b6\u6001", "RECOVERY", "personality.recoveryStatus", "span-4"],
        ["\u521b\u4f24\u5f71\u54cd", "IMPACT", "personality.traumaImpact", "span-4"],
      ],
    },
  ],
  behavior: [
    {
      title: "HABITUAL ACTIONS",
      fields: [
        ["\u601d\u8003\u52a8\u4f5c", "THINKING", "behaviorSystem.thinkingAction"],
        ["\u70e6\u8e81\u52a8\u4f5c", "IRRITATED", "behaviorSystem.irritatedAction"],
        ["\u7d27\u5f20\u52a8\u4f5c", "NERVOUS", "behaviorSystem.nervousAction"],
        ["\u653e\u677e\u52a8\u4f5c", "RELAXED", "behaviorSystem.relaxedAction"],
        ["\u8bf4\u8c0e\u52a8\u4f5c", "LYING", "behaviorSystem.lyingAction"],
        ["\u5bb3\u7f9e\u52a8\u4f5c", "SHY", "behaviorSystem.shyAction"],
      ],
    },
    {
      title: "SPEECH STYLE",
      fields: [
        ["\u8bed\u901f", "SPEED", "behaviorSystem.speechSpeed"],
        ["\u8bed\u6c14", "TONE", "behaviorSystem.speechTone"],
        ["\u53e3\u7656", "CATCHPHRASE", "behaviorSystem.catchphrase"],
        ["\u6218\u6597\u53f0\u8bcd", "BATTLE LINE", "behaviorSystem.battleLine"],
      ],
    },
    {
      title: "MOVEMENT LANGUAGE",
      fields: [
        ["\u8d70\u8def\u65b9\u5f0f", "WALK", "behaviorSystem.walkStyle"],
        ["\u6218\u6597\u59ff\u6001", "STANCE", "behaviorSystem.combatStance"],
        ["\u5f85\u673a\u52a8\u4f5c", "IDLE", "behaviorSystem.idleAction"],
        ["\u653b\u51fb\u8282\u594f", "RHYTHM", "behaviorSystem.attackRhythm"],
      ],
    },
  ],
  life: [
    {
      title: "FOOD PREFERENCES",
      fields: [
        ["\u6700\u7231\u98df\u7269", "FAVORITE", "lifestyle.favoriteFood"],
        ["\u8ba8\u538c\u98df\u7269", "HATED", "lifestyle.hatedFood"],
        ["\u9690\u85cf\u6700\u7231", "SECRET FAV", "lifestyle.hiddenFavorite"],
        ["\u98df\u91cf", "APPETITE", "lifestyle.appetite"],
        ["\u9152\u91cf", "ALCOHOL", "lifestyle.alcoholTolerance"],
        ["\u6599\u7406\u80fd\u529b", "COOKING", "lifestyle.cookingSkill"],
      ],
    },
    {
      title: "LIVING ENVIRONMENT",
      fields: [
        ["\u623f\u95f4\u98ce\u683c", "ROOM STYLE", "lifestyle.roomStyle"],
        ["\u6574\u6d01\u5ea6", "NEATNESS", "lifestyle.neatness"],
        ["\u6536\u85cf\u7269", "COLLECTION", "lifestyle.collections"],
        ["\u5ba0\u7269\u60c5\u51b5", "PETS", "lifestyle.pets"],
      ],
    },
  ],
  social: [
    {
      title: "SOCIAL ABILITY",
      fields: [
        ["\u793e\u4ea4\u80fd\u529b", "SOCIAL", "socialSystem.socialAbility"],
        ["\u8bf4\u8c0e\u80fd\u529b", "LYING", "socialSystem.lyingAbility"],
        ["\u8fb9\u754c\u611f", "BOUNDARY", "socialSystem.boundarySense"],
        ["\u4eba\u6c14", "POPULARITY", "socialSystem.popularity"],
      ],
    },
    {
      title: "RELATIONSHIP TENDENCY",
      fields: [
        ["\u604b\u7231\u7ecf\u9a8c", "ROMANCE EXP", "socialSystem.romanceExperience"],
        ["\u559c\u6b22\u7c7b\u578b", "TYPE", "socialSystem.preferredType"],
        ["\u8868\u8fbe\u65b9\u5f0f", "EXPRESSION", "socialSystem.expressionStyle"],
        ["\u5360\u6709\u6b32", "POSSESSIVE", "socialSystem.possessiveness"],
      ],
    },
  ],
  combat: [
    {
      title: "COMBAT STYLE",
      fields: [
        ["\u6218\u6597\u539f\u578b", "\u539f\u578b", "combatSystem.battleArchetype"],
        ["\u6218\u6597\u7c7b\u578b", "TYPE", "combatSystem.combatType"],
        ["\u6838\u5fc3\u6253\u6cd5", "CORE STYLE", "combatSystem.coreStyle"],
        ["\u7279\u6b8a\u80fd\u529b", "ABILITY", "combatSystem.specialAbility"],
      ],
    },
    {
      title: "WEAPON LOGIC",
      fields: [
        ["\u89c6\u89c9\u6b66\u5668", "VISUAL WEAPON", "combatSystem.visualWeapon"],
        ["\u6218\u6597\u529f\u80fd", "COMBAT FUNCTION", "combatSystem.combatFunction"],
        ["\u6b66\u5668\u6765\u6e90", "SOURCE", "combatSystem.weaponSource"],
        ["\u7981\u7528\u76f4\u8bd1", "NO DIRECT TOOL", "combatSystem.forbiddenDirectTool"],
        ["\u53d8\u5f62\u903b\u8f91", "TRANSFORM", "combatSystem.weaponTransformation", "span-4 textarea-field"],
        ["\u5947\u5e7b\u89e3\u91ca", "FANTASY WHY", "combatSystem.fantasyExplanation", "span-4 textarea-field"],
        ["\u6700\u7ec8\u6b66\u5668", "FINAL WEAPON", "combatSystem.weaponPreference", "span-4 textarea-field"],
      ],
    },
    {
      title: "COMBAT TRAITS",
      fields: [
        ["\u8010\u75db", "PAIN TOL.", "combatSystem.painTolerance"],
        ["\u653b\u51fb\u6027", "AGGRESSION", "combatSystem.aggression"],
        ["\u8010\u529b", "STAMINA", "combatSystem.stamina"],
        ["\u7206\u53d1\u529b", "BURST", "combatSystem.burstPower"],
        ["\u538b\u8feb\u611f", "PRESSURE", "combatSystem.pressure"],
        ["\u53cd\u5e94\u901f\u5ea6", "REACTION", "combatSystem.reactionSpeed"],
      ],
    },
  ],
  world: [
    {
      title: "BACKGROUND",
      fields: [
        ["\u51fa\u8eab\u5730", "ORIGIN", "worldSetting.origin"],
        ["\u793e\u4f1a\u9636\u5c42", "CLASS", "worldSetting.socialClass"],
        ["\u6559\u80b2\u7a0b\u5ea6", "EDUCATION", "worldSetting.education"],
        ["\u72af\u7f6a\u8bb0\u5f55", "RECORD", "worldSetting.criminalRecord"],
        ["\u7ec4\u7ec7\u5730\u4f4d", "RANK", "worldSetting.organizationRank"],
        ["\u654c\u5bf9\u52bf\u529b", "ENEMIES", "worldSetting.enemyForces"],
      ],
    },
    {
      title: "PERSONAL HISTORY",
      fields: [
        ["\u6700\u540e\u6094\u7684\u4e8b", "REGRET", "worldSetting.biggestRegret"],
        ["\u6700\u5927\u76ee\u6807", "GOAL", "worldSetting.biggestGoal"],
        ["\u9690\u85cf\u68a6\u60f3", "DREAM", "worldSetting.hiddenDream"],
        ["\u6700\u91cd\u8981\u7684\u4eba", "IMPORTANT", "worldSetting.mostImportantPerson"],
        ["\u96be\u5fd8\u7ecf\u5386", "MEMORY", "worldSetting.unforgettableExperience", "span-4"],
        ["\u4eba\u751f\u6c61\u70b9", "STAIN", "worldSetting.lifeStain", "span-4"],
      ],
    },
  ],
  unlock: [
    {
      title: "HIDDEN UNLOCKS",
      fields: [
        ["\u7f9e\u803b\u79d8\u5bc6", "SHAME", "hiddenInformation.shameSecret"],
        ["\u9690\u85cf\u7231\u597d", "HOBBY", "hiddenInformation.hiddenHobby"],
        ["\u5f31\u70b9", "WEAKNESS", "hiddenInformation.weakness"],
        ["\u79d8\u5bc6\u4e60\u60ef", "SECRET HABIT", "hiddenInformation.secretHabit"],
        ["\u53cd\u5dee\u9762", "CONTRAST", "hiddenInformation.contrastSide"],
        ["\u8fc7\u654f\u98df\u7269", "ALLERGY", "hiddenInformation.foodAllergy"],
      ],
    },
  ],
  stats: [
    {
      title: "ALL VALUE",
      fields: [
        ["\u8d2b\u5bcc", "WEALTH", "numericalAttributes.wealth", "brown"],
        ["\u9053\u5fb7", "MORALITY", "numericalAttributes.morality", "blue"],
        ["\u7406\u667a", "SANITY", "numericalAttributes.sanity", "purple"],
        ["\u81ea\u4fe1", "CONFIDENCE", "numericalAttributes.confidence", "gold"],
        ["\u538b\u529b", "STRESS", "numericalAttributes.stress", "pink"],
        ["\u5371\u9669", "DANGER", "numericalAttributes.danger", "red"],
        ["\u6b32\u671b", "DESIRE", "numericalAttributes.desire", "magenta"],
        ["\u5fe0\u8bda", "LOYALTY", "numericalAttributes.loyalty", "indigo"],
        ["\u60c5\u7eea\u7a33\u5b9a", "STABILITY", "numericalAttributes.stability", "orange"],
        ["\u793e\u4ea4\u80fd\u529b", "SOCIAL", "numericalAttributes.social", "green"],
        ["\u81ea\u6bc1\u503e\u5411", "DOOM", "numericalAttributes.doom", "doom", "span-4"],
        ["\u66b4\u529b\u503e\u5411", "VIOLENCE", "numericalAttributes.violence", "violence", "span-4"],
        ["\u8111\u6d1e", "IMAGINATION", "numericalAttributes.imagination", "purple"],
        ["\u4e16\u754c\u7ed1\u5b9a", "WORLD BIND", "numericalAttributes.worldBinding", "indigo"],
        ["\u6587\u5316\u6df7\u5408", "CULTURE MIX", "numericalAttributes.identityMix", "green"],
        ["\u540d\u5b57\u73b0\u5b9e\u611f", "NAME REAL", "numericalAttributes.nameRealism", "brown"],
      ],
    },
  ],
  prompt: [
    {
      title: "FULL BODY PROMPT",
      fields: [
        ["\u4e2d\u6587\u63d0\u793a\u8bcd", "CN PROMPT", "metaDesign.characterImagePromptCn", "span-4 textarea-field prompt-textarea-field"],
        ["\u82f1\u6587\u63d0\u793a\u8bcd", "EN PROMPT", "metaDesign.characterImagePrompt", "span-4 textarea-field prompt-textarea-field"],
      ],
    },
  ],
};

function renderProfileField([label, labelEn, path, spanClass = "span-2"]) {
  const control = spanClass.includes("textarea-field")
    ? `<textarea data-field="${escapeHtml(path)}"></textarea>`
    : `<input data-field="${escapeHtml(path)}" />`;
  return `<label class="${spanClass}">${escapeHtml(label)} / ${escapeHtml(labelEn)}${control}</label>`;
}

function renderStatField([label, labelEn, path, tone, spanClass = "span-2"]) {
  return `
    <label class="stat-field ${spanClass} tone-${escapeHtml(tone)}">
      <span>${escapeHtml(label)} / ${escapeHtml(labelEn)}</span>
      <div class="stat-control">
        <input data-field="${escapeHtml(path)}" data-stat-input type="number" min="0" max="100" step="1" />
        <div class="stat-meter" aria-hidden="true"><span></span></div>
      </div>
    </label>
  `;
}

function renderProfileCategoryHeader(title) {
  return `
    <div class="profile-category-header">
      <span>${escapeHtml(title)}</span>
      <svg width="7" height="6" viewBox="0 0 7 6" fill="none" aria-hidden="true">
        <path d="M4.10695 5.27241C3.80819 5.70916 3.19181 5.70916 2.89305 5.27241L0.142881 1.25183C-0.214376 0.729544 0.139344 -2.45776e-05 0.749826 -2.45242e-05L6.25017 -2.40434e-05C6.86066 -2.399e-05 7.21438 0.729544 6.85712 1.25183L4.10695 5.27241Z" fill="#B2A79B"/>
      </svg>
    </div>
  `;
}

function migrateDeveloperSettings(dev) {
  const migrated = { ...developerDefaults, ...(dev || {}) };
  if (!migrated.textLimitUnitVersion) {
    for (const key of ["heroNameLimit", "heroFactionLimit", "listNameLimit", "listFactionLimit"]) {
      migrated[key] = Math.round((migrated[key] ?? developerDefaults[key]) * 2);
    }
    migrated.textLimitUnitVersion = 2;
  }
  return { ...migrated, ...fixedDeveloperSettings };
}

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_CHARACTERS)) {
        const store = database.createObjectStore(STORE_CHARACTERS, { keyPath: "id" });
        store.createIndex("updatedAt", "updatedAt");
      }
      if (!database.objectStoreNames.contains(STORE_SETTINGS)) {
        database.createObjectStore(STORE_SETTINGS, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function tx(storeName, mode = "readonly") {
  return db.transaction(storeName, mode).objectStore(storeName);
}

function getAll(storeName) {
  return new Promise((resolve, reject) => {
    const request = tx(storeName).getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function put(storeName, value) {
  return new Promise((resolve, reject) => {
    const request = tx(storeName, "readwrite").put(value);
    request.onsuccess = () => resolve(value);
    request.onerror = () => reject(request.error);
  });
}

function remove(storeName, key) {
  return new Promise((resolve, reject) => {
    const request = tx(storeName, "readwrite").delete(key);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function loadServerData() {
  try {
    const response = await fetch(SERVER_DATA_URL, { cache: "no-store" });
    if (!response.ok) return null;
    serverPersistenceAvailable = true;
    return await response.json();
  } catch {
    serverPersistenceAvailable = false;
    return null;
  }
}

async function loadNameSamples() {
  try {
    const response = await fetch(NAME_SAMPLES_URL, { cache: "no-store" });
    if (!response.ok) return;
    nameSamples = normalizeNameSamples(await response.json());
  } catch {
    nameSamples = normalizeNameSamples(nameSamples);
  }
}

async function saveNameSamples() {
  const payload = normalizeNameSamples(nameSamples);
  nameSamples = payload;
  const response = await fetch(NAME_SAMPLES_URL, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("\u6837\u672c\u5e93\u4fdd\u5b58\u5931\u8d25");
  return response.json();
}

async function saveServerData() {
  if (!serverPersistenceAvailable) return false;
  const payload = {
    settings,
    characters,
  };
  try {
    const response = await fetch(SERVER_DATA_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    serverPersistenceAvailable = response.ok;
    return response.ok;
  } catch {
    serverPersistenceAvailable = false;
    return false;
  }
}

async function deleteCharacterOnServer(id) {
  if (!serverPersistenceAvailable) return null;
  try {
    const response = await fetch("/api/characters/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!response.ok) {
      serverPersistenceAvailable = response.status !== 404;
      return null;
    }
    return await response.json();
  } catch {
    serverPersistenceAvailable = false;
    return null;
  }
}

async function persistAllData() {
  for (const character of characters) await put(STORE_CHARACTERS, character);
  await put(STORE_SETTINGS, { id: "global", ...settings });
  await saveServerData();
}

async function hydrateFromServerData(force = false) {
  const serverData = await loadServerData();
  const serverCharacters = Array.isArray(serverData?.characters) ? serverData.characters : [];
  if (!serverCharacters.length) return false;
  const newestServerUpdate = serverCharacters.reduce((latest, item) => {
    const value = String(item.updatedAt || "");
    return value > latest ? value : latest;
  }, "");
  const newestLocalUpdate = characters.reduce((latest, item) => {
    const value = String(item.updatedAt || "");
    return value > latest ? value : latest;
  }, "");
  if (!force && newestServerUpdate <= newestLocalUpdate) return false;
  if (serverData.settings) settings = normalizeSettings(serverData.settings);
  characters = serverCharacters.map(normalizeCharacter);
  characters.sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
  if (!characters.some((item) => item.id === currentId)) currentId = characters[0]?.id || null;
  for (const character of characters) await put(STORE_CHARACTERS, character);
  await put(STORE_SETTINGS, { id: "global", ...settings });
  return true;
}

function makeCharacter(seed = {}) {
  const now = new Date().toISOString();
  return {
    id: makeId(),
    createdAt: now,
    updatedAt: now,
    agentMarks: [],
    activeMarks: { attributes: false, images: true },
    generationProfile: {
      notes: generationNotesDefault,
      notesTemplateSeeded: true,
      selectedPresetId: "",
    },
    assets: {
      fullBody: CHARACTER_PLACEHOLDER,
      thumbnail: "",
      referenceSheet: "",
      costume: "",
      props: "",
      expression: "",
    },
    coreIdentity: {
      name: "",
      codename: "",
      alias: "",
      faction: "\u91cd\u88c5\u5b89\u4fdd\u961f",
      birthday: "",
      age: "",
      height: "",
      weight: "",
      occupation: "",
      affiliation: "",
      species: "",
      heritage: "",
    },
    visualIdentity: {
      visualKeywords: "",
      colorLanguage: "",
      facialHair: "",
    },
    costumeSystem: {},
    personality: {
      corePersonality: "",
    },
    lifestyle: {},
    socialSystem: {},
    combatSystem: {
      battleArchetype: "\u5b88\u62a4\u578b\u54cd\u5e94\u8005",
    },
    worldSetting: {},
    hiddenInformation: {},
    numericalAttributes: { ...numericalAttributeDefaults },
    namingProfile: {
      primaryCulture: "",
      secondaryCulture: "",
      templateFamily: "",
      registeredName: "",
      displayName: "",
      alias: "",
      codename: "",
    },
    metaDesign: {
      characterHook: "",
      characterConsistencyPrompt: "",
      characterImagePrompt: "",
      referenceSheetPrompt: "",
      propsPrompt: "",
      costumePrompt: "",
    },
    ...seed,
  };
}

function normalizeCharacter(character = {}) {
  const base = makeCharacter();
  const normalized = { ...base, ...character };
  normalized.agentMarks = Array.isArray(character.agentMarks) ? character.agentMarks : [];
  for (const key of [
    "activeMarks",
    "generationProfile",
    "assets",
    "coreIdentity",
    "visualIdentity",
    "costumeSystem",
    "personality",
    "lifestyle",
    "socialSystem",
    "combatSystem",
    "worldSetting",
    "hiddenInformation",
    "numericalAttributes",
    "namingProfile",
    "metaDesign",
  ]) {
    normalized[key] = { ...(base[key] || {}), ...(character[key] || {}) };
  }
  normalized.id = character.id || base.id;
  normalized.createdAt = character.createdAt || base.createdAt;
  normalized.updatedAt = character.updatedAt || base.updatedAt;
  normalized.assets.fullBody ||= CHARACTER_PLACEHOLDER;
  if (!normalized.generationProfile.notesTemplateSeeded && !String(normalized.generationProfile.notes || "").trim()) {
    normalized.generationProfile.notes = generationNotesDefault;
    normalized.generationProfile.notesTemplateSeeded = true;
  }
  const battleArchetype = normalized.combatSystem.battleArchetype;
  if (battleArchetypeTranslations[battleArchetype]) {
    normalized.combatSystem.battleArchetype = battleArchetypeTranslations[battleArchetype];
  }
  return normalized;
}

function getCurrent() {
  return characters.find((item) => item.id === currentId) || null;
}

function getPath(obj, path) {
  return path.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), obj);
}

function setPath(obj, path, value) {
  const keys = path.split(".");
  let cursor = obj;
  for (const key of keys.slice(0, -1)) {
    cursor[key] ||= {};
    cursor = cursor[key];
  }
  cursor[keys.at(-1)] = value;
}

function fillProfileFields(character) {
  for (const field of els.form.querySelectorAll("[data-field]")) {
    field.value = getPath(character, field.dataset.field) || "";
  }
  syncStatMeters();
}

function syncStatMeters(root = els.form) {
  if (!root) return;
  for (const input of root.querySelectorAll("[data-stat-input]")) {
    if (input.value === "") input.value = "30";
    const value = Math.min(100, Math.max(0, Number(input.value || 0)));
    input.value = Number.isFinite(value) ? String(value) : "30";
    const statField = input.closest(".stat-field");
    const statValue = Number.isFinite(value) ? value : 0;
    statField?.style.setProperty("--stat-value", `${statValue}%`);
    statField?.style.setProperty("--stat-divider-color", statValue > 0 && statValue < 100 ? "var(--stat-color)" : "transparent");
  }
}

function updateStatFromPointer(event, meter) {
  const field = meter.closest(".stat-field")?.querySelector("[data-stat-input]");
  if (!field) return;
  const rect = meter.getBoundingClientRect();
  const ratio = rect.width ? (event.clientX - rect.left) / rect.width : 0;
  field.value = String(Math.min(100, Math.max(0, Math.round(ratio * 100))));
  syncStatMeters(field.closest(".profile-category-fields") || els.form);
  updateField(field.dataset.field, field.value);
}

function renderProfileModule() {
  if (!els.form) return;
  const module = profileModules[currentProfileModule] || profileModules.identity;
  if (els.profileSectionTitle) els.profileSectionTitle.textContent = module.title;
  if (els.profileSectionTitleEn) els.profileSectionTitleEn.textContent = module.titleEn;
  els.profileModuleSwitch?.querySelectorAll("[data-profile-module]").forEach((button) => {
    button.classList.toggle("active", button.dataset.profileModule === currentProfileModule);
  });

  if (currentProfileModule === "identity") {
    els.form.classList.remove("is-empty");
    els.form.classList.remove("is-prompt");
    els.form.classList.add("is-identity");
    els.form.innerHTML = identityProfileTemplate;
    const character = getCurrent();
    if (character) fillProfileFields(character);
    requestAnimationFrame(updateProfileScrollbar);
    return;
  }

  els.form.classList.toggle("is-empty", currentProfileModule !== "prompt");
  els.form.classList.remove("is-identity");
  els.form.classList.toggle("is-prompt", currentProfileModule === "prompt");
  const groups = profileModuleFields[currentProfileModule] || [{ title: module.titleEn, fields: [] }];
  els.form.innerHTML = `
    <div class="profile-category-list">
      ${groups
        .map(
          (group) => `
            <section class="profile-category-section">
              ${renderProfileCategoryHeader(group.title)}
              <div class="profile-category-fields ${group.fields.length ? "" : "profile-empty"}">
                ${(group.fields || []).map(currentProfileModule === "stats" ? renderStatField : renderProfileField).join("")}
              </div>
            </section>
          `,
        )
        .join("")}
    </div>
    ${
      currentProfileModule === "prompt"
        ? `<button id="nameSamplesOpenBtn" class="sample-library-open" type="button">\u6837\u672c\u5e93</button>`
        : ""
    }
  `;
  const character = getCurrent();
  if (character) fillProfileFields(character);
  requestAnimationFrame(updateProfileScrollbar);
}

function updateProfileScrollbar() {
  if (!els.form || !els.profileScrollbar) return;
  const needsScroll = els.form.scrollHeight > els.form.clientHeight + 1;
  els.profileScrollbar.classList.toggle("hidden", !needsScroll);
}

function positionProfileModuleSwitch() {
  if (!els.profileModuleSwitch || !els.centerPanel || !els.profilePanel) return;
  const centerRect = els.centerPanel.getBoundingClientRect();
  const profileRect = els.profilePanel.getBoundingClientRect();
  document.documentElement.style.setProperty("--profile-switch-top", `${profileRect.top - centerRect.top}px`);
}

function setProfileModuleSwitchOpen(open, pinned = profileModulePinned) {
  profileModulePinned = pinned;
  if (!els.profileModuleSwitch) return;
  if (open) positionProfileModuleSwitch();
  els.profileModuleSwitch.classList.toggle("open", open);
  els.profileModuleSwitch.classList.toggle("pinned", profileModulePinned);
}

function pointInRectWithPadding(x, y, rect, padding = 0) {
  return x >= rect.left - padding && x <= rect.right + padding && y >= rect.top - padding && y <= rect.bottom + padding;
}

function formatSavedAt(iso) {
  const date = new Date(iso || Date.now());
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");
  return `\u5df2\u4fdd\u5b58 ${mm}/${dd} ${hh}:${mi}`;
}

function measureTextUnits(text) {
  const dev = migrateDeveloperSettings(settings.developer);
  return Array.from(String(text || "")).reduce((sum, char) => sum + (/[\u4e00-\u9fff]/.test(char) ? dev.cjkUnit : dev.latinUnit), 0);
}

function truncateDisplay(text, maxUnits) {
  const source = String(text || "");
  if (measureTextUnits(source) <= maxUnits) return source;
  let result = "";
  let units = 0;
  const dev = migrateDeveloperSettings(settings.developer);
  const contentMax = Math.max(0, maxUnits - dev.ellipsisUnit);
  for (const char of Array.from(source)) {
    const next = /[\u4e00-\u9fff]/.test(char) ? dev.cjkUnit : dev.latinUnit;
    if (units + next > contentMax) break;
    result += char;
    units += next;
  }
  return `${result}..`;
}

function renderHeroTitle(text) {
  const fallbackChars = new Set(["\u91cf"]);
  return Array.from(text || "")
    .map((char) => {
      const escaped = escapeHtml(char);
      return fallbackChars.has(char) ? `<span class="font-fallback">${escaped}</span>` : escaped;
    })
    .join("");
}

function getOccupationText(character) {
  return character.coreIdentity?.occupation?.trim() || "\u672a\u77e5\u804c\u4e1a";
}

function formatOccupationText(character) {
  return `[  ${getOccupationText(character)}  ]`;
}

function getDisplayName(character) {
  return character.coreIdentity?.name?.trim() || "\u672a\u547d\u540d\u89d2\u8272";
}

function splitStarterPrompt(value) {
  const source = String(value || "").trim();
  if (!source) return { positive: starterPositiveDefault, negative: starterNegativeDefault };
  const lines = source.split(/\r?\n/);
  const markerIndex = lines.findIndex((line) => line.includes("\u9ed8\u8ba4\u7981\u6b62") || line.includes("GLOBAL NEGATIVE"));
  if (markerIndex < 0) return { positive: source, negative: starterNegativeDefault };
  const positive = lines.slice(0, markerIndex).join("\n").trim() || starterPositiveDefault;
  const negativeFirst = lines[markerIndex].replace(/^.*?[：:]\s*/, "").trim();
  const negative = [negativeFirst, ...lines.slice(markerIndex + 1)].filter(Boolean).join("\n").trim() || starterNegativeDefault;
  return { positive, negative };
}

function composeStarterPrompt(positive, negative) {
  return `${String(positive || "").trim()}\n\n\u9ed8\u8ba4\u7981\u6b62\uff1a${String(negative || "").trim()}`.trim();
}

function renderList() {
  const query = els.search.value.trim().toLowerCase();
  const filtered = characters.filter((char) => {
    const name = char.coreIdentity?.name || "";
    const occupation = char.coreIdentity?.occupation || "";
    return `${name} ${occupation}`.toLowerCase().includes(query);
  });

  els.list.innerHTML = "";
  for (const character of filtered) {
    const card = document.createElement("article");
    card.className = `character-card ${character.id === currentId ? "active" : ""}`;
    card.tabIndex = 0;
    card.dataset.id = character.id;
    const image = character.assets?.thumbnail || "";
    const name = getDisplayName(character);
    const occupation = getOccupationText(character);
    card.innerHTML = `
      <div class="thumb">${image ? `<img src="${image}" alt="" />` : ""}</div>
      <div>
        <div class="card-name" title="${escapeHtml(character.coreIdentity?.name || "")}">${escapeHtml(name)}</div>
        <div class="card-meta" title="${escapeHtml(occupation)}">${escapeHtml(formatOccupationText(character))}</div>
      </div>
      <button class="card-delete" type="button" data-delete-character="${character.id}" aria-label="\u5220\u9664\u89d2\u8272">
        <svg width="7" height="7" viewBox="0 0 7 7" fill="none" aria-hidden="true">
          <path d="M7 0.86275L6.13725 0L3.5 2.63725L0.86275 0L0 0.86275L2.63725 3.5L0 6.13725L0.86275 7L3.5 4.36275L6.13725 7L7 6.13725L4.36275 3.5L7 0.86275Z" fill="currentColor"/>
        </svg>
      </button>
    `;
    els.list.appendChild(card);
  }
}

function renderCharacter() {
  const character = getCurrent();
  if (!character) return;
  const dev = migrateDeveloperSettings(settings.developer);

  els.heroName.innerHTML = renderHeroTitle(getDisplayName(character));
  els.heroName.title = character.coreIdentity?.name?.trim() || "\u672a\u547d\u540d\u89d2\u8272";
  els.heroFaction.textContent = formatOccupationText(character);
  els.heroFaction.title = getOccupationText(character);
  els.savedAt.textContent = formatSavedAt(character.updatedAt);
  els.characterImage.src = character.assets?.[currentAsset] || character.assets?.fullBody || CHARACTER_PLACEHOLDER;

  for (const field of els.form.querySelectorAll("[data-field]")) {
    field.value = getPath(character, field.dataset.field) || "";
  }

  if (els.generationNotes) els.generationNotes.value = character.generationProfile?.notes || "";
  if (els.starterPrompt) els.starterPrompt.value = settings.starterPrompt || starterPromptDefault;
  if (els.starterPositivePrompt && els.starterNegativePrompt) {
    const starter = splitStarterPrompt(settings.starterPrompt || starterPromptDefault);
    els.starterPositivePrompt.value = starter.positive;
    els.starterNegativePrompt.value = starter.negative;
  }
  renderStyleReference();
  setMarkButtons(character);
  renderList();
  renderPresets();
  applyDeveloperSettings();
}

function renderStyleReference() {
  if (!els.styleReferencePreview || !els.styleReferenceName) return;
  const reference = settings.styleReference || {};
  els.styleReferencePreview.innerHTML = reference.image
    ? `<img src="${escapeHtml(reference.image)}" alt="\u58ee\u6c49\u98ce\u683c\u53c2\u8003" />`
    : "";
  els.styleReferenceName.textContent = reference.fileName || "\u672a\u4e0a\u4f20\u53c2\u8003\u56fe";
}

function setMarkButtons(character) {
  const attributes = !!character.activeMarks?.attributes;
  const images = !!character.activeMarks?.images;
  els.attributeMark.classList.toggle("active", attributes);
  els.imageMark.classList.toggle("active", images);
  els.attributeMark.querySelector("small").textContent = attributes ? "ON" : "OFF";
  els.imageMark.querySelector("small").textContent = images ? "ON" : "OFF";
  const labels = [];
  if (attributes) labels.push("ATTRIBUTES");
  if (images) labels.push("IMAGES");
  const isActive = labels.length > 0;
  els.markSummary.textContent = isActive ? `[${labels.join("] + [")}]` : "NULL";
  els.markSummary.classList.toggle("empty", !isActive);
  els.profileOpen.classList.toggle("hidden", !isActive);
  els.agentRow.classList.toggle("empty", !isActive);
  els.agentRow.querySelector("span:first-child").textContent = isActive
    ? "Agent \u5c06\u5148\u68c0\u67e5\u5c5e\u6027\uff0c\u518d\u751f\u6210\u56fe\u50cf Prompt"
    : "\u8bf7\u9009\u62e9\u9700\u8981 AI \u534f\u52a9\u751f\u6210\u7684\u5185\u5bb9";
  els.agentLamp.classList.toggle("on", isActive);
}

function queueSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveCurrent, 220);
}

function applyDeveloperSettings() {
  const dev = migrateDeveloperSettings(settings.developer);
  settings.developer = dev;
  const root = document.documentElement;
  root.style.setProperty("--upload-x", `${dev.uploadX}px`);
  root.style.setProperty("--upload-y", `${dev.uploadY}px`);
  root.style.setProperty("--delete-x", `${dev.deleteX}px`);
  root.style.setProperty("--delete-y", `${dev.deleteY}px`);
  root.style.setProperty("--hero-text-x", `${dev.heroTextX}px`);
  root.style.setProperty("--hero-text-y", `${dev.heroTextY}px`);
  root.style.setProperty("--hero-text-width", `${dev.heroTextWidth}px`);
  root.style.setProperty("--list-text-width", `${dev.listTextWidth}px`);
  root.style.setProperty("--search-icon-x", `${dev.searchIconX}px`);
  root.style.setProperty("--search-icon-y", `${dev.searchIconY}px`);
  root.style.setProperty("--character-scale", dev.characterScale);
  root.style.setProperty("--character-x", `${dev.characterX}%`);
  root.style.setProperty("--character-y", `${dev.characterY}px`);
  root.style.setProperty("--barcode-x", `${dev.barcodeX}px`);
  root.style.setProperty("--barcode-y", `${dev.barcodeY}px`);
  root.style.setProperty("--barcode-scale", dev.barcodeScale);
  root.style.setProperty("--dossier-x", `${dev.dossierX}px`);
  root.style.setProperty("--dossier-y", `${dev.dossierY}px`);
  if (Number.isFinite(dev.panelLeft) && Number.isFinite(dev.panelTop)) {
    root.style.setProperty("--dev-panel-left", `${dev.panelLeft}px`);
    root.style.setProperty("--dev-panel-top", `${dev.panelTop}px`);
    root.style.setProperty("--dev-panel-transform", "none");
  }
  for (const input of els.devControls) {
    input.value = dev[input.dataset.dev];
  }
  for (const value of els.devValues) {
    const key = value.dataset.devValue;
    value.textContent = dev[key];
  }
}

async function saveCurrent() {
  const character = getCurrent();
  if (!character) return;
  character.updatedAt = new Date().toISOString();
  await put(STORE_CHARACTERS, character);
  await put(STORE_SETTINGS, { id: "global", ...settings });
  await saveServerData();
  els.savedAt.textContent = formatSavedAt(character.updatedAt);
  renderList();
}

async function createCharacter() {
  const character = makeCharacter({
    coreIdentity: {
      name: "",
      codename: "",
      alias: "",
      faction: "\u672a\u5f52\u6863",
      birthday: "",
      age: "",
      height: "",
      weight: "",
      occupation: "",
      affiliation: "",
      species: "",
    },
  });
  characters.unshift(character);
  currentId = character.id;
  await persistAllData();
  renderCharacter();
}

async function duplicateCurrent() {
  const character = getCurrent();
  if (!character) return;
  const copy = structuredClone(character);
  copy.id = makeId();
  copy.createdAt = new Date().toISOString();
  copy.updatedAt = copy.createdAt;
  copy.coreIdentity.name = `${copy.coreIdentity.name || "\u672a\u547d\u540d\u89d2\u8272"} \u526f\u672c`;
  characters.unshift(copy);
  currentId = copy.id;
  await persistAllData();
  renderCharacter();
}

async function deleteCurrent() {
  if (!currentId) return;
  await deleteCharacter(currentId);
}

async function deleteCharacter(id) {
  if (characters.length <= 1) return;
  const character = characters.find((item) => item.id === id);
  if (!character) return;
  const ok = confirm(`\u5220\u9664\u89d2\u8272\u300c${character.coreIdentity?.name || "\u672a\u547d\u540d\u89d2\u8272"}\u300d\uff1f`);
  if (!ok) return;
  const serverDeletion = await deleteCharacterOnServer(character.id);
  await remove(STORE_CHARACTERS, character.id);
  characters = characters.filter((item) => item.id !== character.id);
  if (currentId === character.id) currentId = characters[0]?.id || null;
  if (!serverDeletion) await saveServerData();
  renderCharacter();
}

function updateField(path, value) {
  const character = getCurrent();
  if (!character) return;
  setPath(character, path, value);
  queueSave();
}

function addAgentMark(type) {
  const character = getCurrent();
  if (!character) return;
  const mark = type === "attributes" ? "[GENERATE_ATTRIBUTES]" : "[GENERATE_IMAGES]";
  character.activeMarks ||= { attributes: false, images: false };
  character.agentMarks ||= [];
  character.activeMarks[type] = !character.activeMarks[type];
  character.agentMarks.push({ id: makeId(), mark, createdAt: new Date().toISOString() });
  setMarkButtons(character);
  queueSave();
}

function renderPresets() {
  if (!els.presetList) return;
  els.presetList.innerHTML = "";
  for (const preset of settings.presets || []) {
    const card = document.createElement("article");
    card.className = "preset-card";
    card.innerHTML = `
      <strong>${escapeHtml(preset.name)}</strong>
      <p>${escapeHtml(preset.content)}</p>
      <button type="button" data-use="${preset.id}">\u8bfb\u53d6</button>
      <button type="button" data-delete="${preset.id}">\u5220\u9664</button>
    `;
    els.presetList.appendChild(card);
  }
}

async function savePreset() {
  const name = els.presetName.value.trim();
  const content = els.presetContent.value.trim();
  if (!name || !content) return;
  settings.presets = settings.presets || [];
  const existing = settings.presets.find((preset) => preset.name === name);
  if (existing) existing.content = content;
  else settings.presets.push({ id: makeId(), name, content });
  els.presetName.value = "";
  els.presetContent.value = "";
  renderPresets();
  await saveCurrent();
}

async function exportJson() {
  await saveCurrent();
  const payload = {
    app: "OC Character Bible Workbench",
    exportedAt: new Date().toISOString(),
    settings,
    characters,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `oc-character-bible-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

async function importJson(file) {
  const text = await file.text();
  const payload = JSON.parse(text);
  const imported = Array.isArray(payload.characters) ? payload.characters : Array.isArray(payload) ? payload : [];
  for (const item of imported) {
    item.id ||= makeId();
    item.updatedAt = new Date().toISOString();
      await put(STORE_CHARACTERS, normalizeCharacter(item));
  }
  if (payload.settings) {
    settings = normalizeSettings(payload.settings || {});
    await put(STORE_SETTINGS, { id: "global", ...settings });
  }
  characters = (await getAll(STORE_CHARACTERS)).map(normalizeCharacter);
  characters.sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
  currentId = imported[0]?.id || characters[0]?.id || null;
  await saveServerData();
  renderCharacter();
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function getCurrentSampleCulture() {
  const cultures = nameSamples.cultures || {};
  if (!cultures[currentSampleCulture]) currentSampleCulture = Object.keys(cultures)[0] || "japanese";
  if (!cultures[currentSampleCulture]) {
    cultures[currentSampleCulture] = { label: sampleCultureFallbacks[currentSampleCulture] || currentSampleCulture, categories: {} };
  }
  cultures[currentSampleCulture].categories ||= {};
  return cultures[currentSampleCulture];
}

function getCurrentSampleTokens() {
  const culture = getCurrentSampleCulture();
  return culture.categories?.[currentSampleCategory] || [];
}

function setCurrentSampleTokens(tokens) {
  const culture = getCurrentSampleCulture();
  culture.categories ||= {};
  culture.categories[currentSampleCategory] = dedupeTokens(tokens);
}

function renderSampleCultureTabs() {
  if (!els.sampleCultureTabs) return;
  const cultures = nameSamples.cultures || {};
  const entries = Object.entries(cultures);
  els.sampleCultureTabs.innerHTML = entries
    .map(
      ([key, culture]) =>
        `<button type="button" class="${key === currentSampleCulture ? "active" : ""}" data-sample-culture="${escapeHtml(key)}">${escapeHtml(culture.label || sampleCultureFallbacks[key] || key)}</button>`,
    )
    .join("");
}

function renderSampleCategoryTabs() {
  if (!els.sampleCategoryTabs) return;
  els.sampleCategoryTabs.innerHTML = Object.entries(sampleCategoryLabels)
    .map(
      ([key, label]) =>
        `<button type="button" class="${key === currentSampleCategory ? "active" : ""}" data-sample-category="${escapeHtml(key)}">${escapeHtml(label)}</button>`,
    )
    .join("");
}

function renderSampleLibrary() {
  renderSampleCultureTabs();
  renderSampleCategoryTabs();
  if (els.sampleTextarea) els.sampleTextarea.value = getCurrentSampleTokens().join(" ");
  if (els.sampleStatus) {
    const culture = getCurrentSampleCulture();
    const label = sampleCategoryLabels[currentSampleCategory] || currentSampleCategory;
    els.sampleStatus.textContent = `${culture.label || currentSampleCulture} / ${label} / ${getCurrentSampleTokens().length} \u9879`;
  }
}

function openSampleLibrary() {
  renderSampleLibrary();
  els.sampleDialog?.showModal();
}

async function persistSampleLibraryFromTextarea() {
  setCurrentSampleTokens(splitSampleText(els.sampleTextarea?.value || ""));
  renderSampleLibrary();
  await saveNameSamples();
  if (els.sampleStatus) els.sampleStatus.textContent += " / \u5df2\u4fdd\u5b58";
}

function bindEvents() {
  const searchToggle = document.querySelector(".search-toggle");
  const syncSearchToggle = () => searchToggle?.classList.toggle("has-value", !!els.search.value.trim());
  els.search?.addEventListener("input", () => {
    syncSearchToggle();
    renderList();
  });
  searchToggle?.addEventListener("click", () => {
    if (els.search.value) {
      els.search.value = "";
      syncSearchToggle();
      renderList();
    }
    els.search.focus();
  });
  syncSearchToggle();
  els.list?.addEventListener("click", (event) => {
    const deleteButton = event.target.closest("[data-delete-character]");
    if (deleteButton) {
      event.stopPropagation();
      deleteCharacter(deleteButton.dataset.deleteCharacter);
      return;
    }
    const card = event.target.closest(".character-card");
    if (!card) return;
    currentId = card.dataset.id;
    renderCharacter();
  });
  els.list?.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const card = event.target.closest(".character-card");
    if (!card) return;
    event.preventDefault();
    currentId = card.dataset.id;
    renderCharacter();
  });
  els.newCharacter?.addEventListener("click", createCharacter);
  els.profileModuleSwitch?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-profile-module]");
    if (!button) return;
    currentProfileModule = button.dataset.profileModule;
    renderProfileModule();
  });
  els.profileSectionHead?.addEventListener("pointerenter", () => setProfileModuleSwitchOpen(true, profileModulePinned));
  els.profileSectionHead?.addEventListener("click", (event) => {
    event.stopPropagation();
    setProfileModuleSwitchOpen(true, true);
  });
  els.profileModuleSwitch?.addEventListener("click", (event) => event.stopPropagation());
  document.addEventListener("pointermove", (event) => {
    if (profileModulePinned || !els.profileModuleSwitch?.classList.contains("open")) return;
    const headRect = els.profileSectionHead?.getBoundingClientRect();
    const switchRect = els.profileModuleSwitch.getBoundingClientRect();
    const inHead = headRect ? pointInRectWithPadding(event.clientX, event.clientY, headRect, 0) : false;
    const inSwitchZone = pointInRectWithPadding(event.clientX, event.clientY, switchRect, 20);
    if (!inHead && !inSwitchZone) setProfileModuleSwitchOpen(false, false);
  });
  document.addEventListener("click", (event) => {
    if (!profileModulePinned) return;
    const target = event.target;
    if (els.profileModuleSwitch?.contains(target) || els.profileSectionHead?.contains(target)) return;
    setProfileModuleSwitchOpen(false, false);
  });
  window.addEventListener("resize", () => {
    positionProfileModuleSwitch();
    updateProfileScrollbar();
  });
  window.addEventListener("focus", async () => {
    if (await hydrateFromServerData()) {
      renderProfileModule();
      renderCharacter();
    }
  });
  els.form?.addEventListener("input", (event) => {
    const field = event.target.closest("[data-field]");
    if (!field) return;
    if (field.matches("[data-stat-input]")) {
      if (field.value === "") field.value = "0";
      field.value = String(Math.min(100, Math.max(0, Number(field.value || 0))));
      syncStatMeters(field.closest(".profile-category-fields") || els.form);
    }
    updateField(field.dataset.field, field.value);
    if (["coreIdentity.name", "coreIdentity.occupation"].includes(field.dataset.field)) renderCharacter();
    updateProfileScrollbar();
  });
  els.form?.addEventListener("click", (event) => {
    if (!event.target.closest("#nameSamplesOpenBtn")) return;
    openSampleLibrary();
  });
  let activeStatMeter = null;
  els.form?.addEventListener("pointerdown", (event) => {
    const meter = event.target.closest(".stat-meter");
    if (!meter) return;
    activeStatMeter = meter;
    meter.setPointerCapture?.(event.pointerId);
    updateStatFromPointer(event, meter);
  });
  els.form?.addEventListener("pointermove", (event) => {
    if (!activeStatMeter) return;
    updateStatFromPointer(event, activeStatMeter);
  });
  const clearActiveStatMeter = (event) => {
    activeStatMeter?.releasePointerCapture?.(event.pointerId);
    activeStatMeter = null;
  };
  els.form?.addEventListener("pointerup", clearActiveStatMeter);
  els.form?.addEventListener("pointercancel", clearActiveStatMeter);
  els.assetTabs?.addEventListener("click", (event) => {
    const tab = event.target.closest(".asset-tab");
    if (!tab) return;
    currentAsset = tab.dataset.asset;
    for (const item of els.assetTabs.querySelectorAll(".asset-tab")) item.classList.toggle("active", item === tab);
    renderCharacter();
  });
  els.imageUpload?.addEventListener("change", async () => {
    const file = els.imageUpload.files?.[0];
    if (!file) return;
    const character = getCurrent();
    const dataUrl = await fileToDataUrl(file);
    character.assets[currentAsset] = dataUrl;
    if (currentAsset === "fullBody") character.assets.thumbnail = dataUrl;
    renderCharacter();
    queueSave();
  });
  els.clearImage?.addEventListener("click", () => {
    const character = getCurrent();
    if (!character) return;
    character.assets[currentAsset] = currentAsset === "fullBody" ? CHARACTER_PLACEHOLDER : "";
    if (currentAsset === "fullBody") character.assets.thumbnail = "";
    renderCharacter();
    queueSave();
  });
  els.attributeMark?.addEventListener("click", () => addAgentMark("attributes"));
  els.imageMark?.addEventListener("click", () => addAgentMark("images"));
  els.profileOpen?.addEventListener("click", () => els.dialog?.showModal());
  for (const tab of els.dialogTabs) {
    tab.addEventListener("click", () => {
      for (const item of els.dialogTabs) item.classList.toggle("active", item === tab);
      for (const page of els.dialogPages) page.classList.toggle("active", page.dataset.profilePage === tab.dataset.profileTab);
    });
  }
  els.starterPrompt?.addEventListener("input", () => {
    settings.starterPrompt = els.starterPrompt.value;
    queueSave();
  });
  const syncStarterPromptParts = () => {
    settings.starterPrompt = composeStarterPrompt(els.starterPositivePrompt?.value || "", els.starterNegativePrompt?.value || "");
    queueSave();
  };
  els.starterPositivePrompt?.addEventListener("input", syncStarterPromptParts);
  els.starterNegativePrompt?.addEventListener("input", syncStarterPromptParts);
  els.styleReferenceInput?.addEventListener("change", async () => {
    const file = els.styleReferenceInput.files?.[0];
    if (!file) return;
    settings.styleReference = {
      image: await fileToDataUrl(file),
      fileName: file.name,
    };
    renderStyleReference();
    queueSave();
    els.styleReferenceInput.value = "";
  });
  els.styleReferenceClear?.addEventListener("click", () => {
    settings.styleReference = { image: "", fileName: "" };
    renderStyleReference();
    queueSave();
  });
  els.generationNotes?.addEventListener("input", () => {
    const character = getCurrent();
    character.generationProfile.notes = els.generationNotes.value;
    queueSave();
  });
  els.savePreset?.addEventListener("click", savePreset);
  els.presetList?.addEventListener("click", async (event) => {
    const useId = event.target.dataset.use;
    const deleteId = event.target.dataset.delete;
    if (useId) {
      const preset = settings.presets.find((item) => item.id === useId);
      if (!preset) return;
      const character = getCurrent();
      character.generationProfile.selectedPresetId = preset.id;
      character.generationProfile.notes = `${character.generationProfile.notes || ""}\n${preset.content}`.trim();
      els.generationNotes.value = character.generationProfile.notes;
      queueSave();
    }
    if (deleteId) {
      settings.presets = settings.presets.filter((item) => item.id !== deleteId);
      renderPresets();
      await saveCurrent();
    }
  });
  els.export?.addEventListener("click", exportJson);
  els.import?.addEventListener("change", () => {
    const file = els.import.files?.[0];
    if (file) importJson(file);
  });
  els.sampleCultureTabs?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-sample-culture]");
    if (!button) return;
    setCurrentSampleTokens(splitSampleText(els.sampleTextarea?.value || ""));
    currentSampleCulture = button.dataset.sampleCulture;
    renderSampleLibrary();
  });
  els.sampleCategoryTabs?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-sample-category]");
    if (!button) return;
    setCurrentSampleTokens(splitSampleText(els.sampleTextarea?.value || ""));
    currentSampleCategory = button.dataset.sampleCategory;
    renderSampleLibrary();
  });
  els.sampleDedupe?.addEventListener("click", () => {
    setCurrentSampleTokens(splitSampleText(els.sampleTextarea?.value || ""));
    renderSampleLibrary();
  });
  els.sampleSave?.addEventListener("click", () => {
    persistSampleLibraryFromTextarea().catch((error) => {
      if (els.sampleStatus) els.sampleStatus.textContent = error?.message || "\u6837\u672c\u5e93\u4fdd\u5b58\u5931\u8d25";
    });
  });
  els.devOpen?.addEventListener("click", () => {
    els.devPanel?.classList.toggle("open");
  });
  els.devClose?.addEventListener("click", () => {
    els.devPanel?.classList.remove("open");
  });
  els.devReset?.addEventListener("click", async () => {
    settings.developer = { ...developerDefaults };
    applyDeveloperSettings();
    await saveCurrent();
  });
  for (const input of els.devControls) {
    input.addEventListener("input", () => {
      settings.developer[input.dataset.dev] = Number(input.value);
      applyDeveloperSettings();
      renderCharacter();
      queueSave();
    });
  }
  let dragState = null;
  els.devDragHandle?.addEventListener("pointerdown", (event) => {
    if (event.target.closest("button")) return;
    const rect = els.devPanel.getBoundingClientRect();
    dragState = {
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
    };
    els.devDragHandle.setPointerCapture(event.pointerId);
  });
  els.devDragHandle?.addEventListener("pointermove", (event) => {
    if (!dragState) return;
    const rect = els.devPanel.getBoundingClientRect();
    const left = Math.min(Math.max(event.clientX - dragState.offsetX, 8), window.innerWidth - rect.width - 8);
    const top = Math.min(Math.max(event.clientY - dragState.offsetY, 8), window.innerHeight - rect.height - 8);
    settings.developer.panelLeft = Math.round(left);
    settings.developer.panelTop = Math.round(top);
    applyDeveloperSettings();
  });
  els.devDragHandle?.addEventListener("pointerup", () => {
    if (!dragState) return;
    dragState = null;
    queueSave();
  });
}

async function init() {
  db = await openDb();
  await loadNameSamples();
  const loadedFromServer = await hydrateFromServerData(true);
  if (!loadedFromServer) {
    const savedSettings = await getAll(STORE_SETTINGS);
    if (savedSettings[0]) settings = normalizeSettings(savedSettings[0]);
    settings.developer = migrateDeveloperSettings(settings.developer);
    characters = (await getAll(STORE_CHARACTERS)).map(normalizeCharacter);
  }
  characters.sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
  if (!characters.length) {
    const initial = makeCharacter();
    characters = [initial];
    await persistAllData();
  }
  await persistAllData();
  currentId = characters[0].id;
  bindEvents();
  renderProfileModule();
  renderCharacter();
}

init().catch((error) => {
  console.error(error);
  alert(`Init failed: ${error?.message || error}`);
});

