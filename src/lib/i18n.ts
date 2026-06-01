export type Lang = "uk" | "en";

type Translations = {
  appName: string;
  appSubtitle: string;
  signOut: string;
  // auth
  loginTab: string;
  registerTab: string;
  usernameLabel: string;
  usernamePlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  loginButton: string;
  registerButton: string;
  loggingIn: string;
  registering: string;
  passwordMinLength: string;
  // board
  addColumn: string;
  addItem: string;
  share: string;
  shared: string;
  dropHere: string;
  deleteColumn: string;
  // AddItemDialog
  addToWishlist: string;
  editItem: string;
  nameLabel: string;
  imageUrlLabel: string;
  priceLabel: string;
  categoryLabel: string;
  notesLabel: string;
  columnLabel: string;
  cancel: string;
  saveChanges: string;
  addItemBtn: string;
  saving: string;
  notesPlaceholder: string;
  namePlaceholderItem: string;
  categoryPlaceholder: string;
  // AddColumnDialog
  addColumnTitle: string;
  columnNameLabel: string;
  columnNamePlaceholder: string;
  colorLabel: string;
  create: string;
  creating: string;
  // WishCard
  edit: string;
  openImage: string;
  delete: string;
  bookedBy: string;
  // ShareDialog
  shareTitle: string;
  sharePublishDesc: string;
  sharePublishBtn: string;
  publishing: string;
  shareLinkDesc: string;
  unpublish: string;
  unpublishing: string;
  // ShareView
  iWillGift: string;
  bookTitle: (name: string) => string;
  bookDesc: string;
  yourName: string;
  yourNamePlaceholder: string;
  confirm: string;
  booking: string;
  ownerWishlist: (name: string) => string;
  // Theme
  themeLight: string;
  themeDark: string;
  // Default columns
  colWant: string;
  colPlanned: string;
  colHave: string;
  // Category suggestions
  categorySuggestions: string[];
};

export const translations: Record<Lang, Translations> = {
  en: {
    appName: "bazhannia",
    appSubtitle: "your personal wishlist. add, share, get",
    signOut: "sign out",
    loginTab: "log in",
    registerTab: "register",
    usernameLabel: "username",
    usernamePlaceholder: "e.g. Yana",
    passwordLabel: "password",
    passwordPlaceholder: "at least 6 characters",
    loginButton: "log in",
    registerButton: "create account",
    loggingIn: "logging in…",
    registering: "creating…",
    passwordMinLength: "password must be at least 6 characters",
    addColumn: "add column",
    addItem: "add item",
    share: "share",
    shared: "shared",
    dropHere: "drop items here",
    deleteColumn: "delete column",
    addToWishlist: "add to wishlist",
    editItem: "edit item",
    nameLabel: "name *",
    imageUrlLabel: "image url",
    priceLabel: "price",
    categoryLabel: "category",
    notesLabel: "notes",
    columnLabel: "column",
    cancel: "cancel",
    saveChanges: "save changes",
    addItemBtn: "add item",
    saving: "saving…",
    notesPlaceholder: "any extra details...",
    namePlaceholderItem: "e.g. linen throw blanket",
    categoryPlaceholder: "e.g. home, fashion",
    addColumnTitle: "add column",
    columnNameLabel: "column name *",
    columnNamePlaceholder: "e.g. someday, gifted",
    colorLabel: "color",
    create: "create",
    creating: "creating…",
    edit: "edit",
    openImage: "open image",
    delete: "delete",
    bookedBy: "booked by",
    shareTitle: "share your wishlist",
    sharePublishDesc:
      "publish your wishlist to get a shareable link. friends can view your items and book gifts.",
    sharePublishBtn: "publish & get link",
    publishing: "publishing…",
    shareLinkDesc:
      "share this link with friends so they can see your wishlist and book gifts.",
    unpublish: "unpublish",
    unpublishing: "unpublishing…",
    iWillGift: "i'll gift this",
    bookTitle: (name) => `book "${name}"`,
    bookDesc:
      "let others know you're getting this gift. your name will be shown on the wishlist.",
    yourName: "your name",
    yourNamePlaceholder: "e.g. alice",
    confirm: "confirm",
    booking: "booking…",
    ownerWishlist: (name) => `— ${name}'s wishlist`,
    themeLight: "light",
    themeDark: "dark",
    colWant: "want",
    colPlanned: "planned",
    colHave: "have",
    categorySuggestions: [
      "fashion",
      "home",
      "beauty",
      "tech",
      "books",
      "food",
      "travel",
      "sports",
    ],
  },
  uk: {
    appName: "бажання",
    appSubtitle: "ваш онлайн вішліст. додавай, поширюй, отримуй",
    signOut: "вийти",
    loginTab: "увійти",
    registerTab: "реєстрація",
    usernameLabel: "ім'я користувача",
    usernamePlaceholder: "наприклад Яна",
    passwordLabel: "пароль",
    passwordPlaceholder: "мінімум 6 символів",
    loginButton: "увійти",
    registerButton: "створити акаунт",
    loggingIn: "вхід…",
    registering: "створення…",
    passwordMinLength: "пароль має містити мінімум 6 символів",
    addColumn: "додати колонку",
    addItem: "додати бажання",
    share: "поділитися",
    shared: "опубліковано",
    dropHere: "перетягніть сюди",
    deleteColumn: "видалити колонку",
    addToWishlist: "нове бажання",
    editItem: "редагувати",
    nameLabel: "назва *",
    imageUrlLabel: "посилання на фото",
    priceLabel: "ціна",
    categoryLabel: "категорія",
    notesLabel: "нотатки",
    columnLabel: "колонка",
    cancel: "скасувати",
    saveChanges: "зберегти",
    addItemBtn: "додати",
    saving: "збереження…",
    notesPlaceholder: "додаткові деталі...",
    namePlaceholderItem: "наприклад книга",
    categoryPlaceholder: "наприклад дім, мода",
    addColumnTitle: "нова колонка",
    columnNameLabel: "назва *",
    columnNamePlaceholder: "наприклад колись, подаровано",
    colorLabel: "колір",
    create: "створити",
    creating: "створення…",
    edit: "редагувати",
    openImage: "відкрити фото",
    delete: "видалити",
    bookedBy: "забронював(ла)",
    shareTitle: "поділитися списком",
    sharePublishDesc:
      "опублікуйте список, щоб отримати посилання. друзі зможуть переглянути ваші бажання та зарезервувати подарунки.",
    sharePublishBtn: "опублікувати",
    publishing: "публікація…",
    shareLinkDesc:
      "поділіться цим посиланням з друзями, щоб вони побачили ваш список.",
    unpublish: "приховати",
    unpublishing: "приховання…",
    iWillGift: "я подарую це",
    bookTitle: (name) => `забронювати «${name}»`,
    bookDesc:
      "повідомте інших, що ви купуєте цей подарунок. ваше ім'я буде показано у списку.",
    yourName: "ваше ім'я",
    yourNamePlaceholder: "наприклад Яна",
    confirm: "підтвердити",
    booking: "бронювання…",
    ownerWishlist: (name) => `— список бажань ${name}`,
    themeLight: "світла",
    themeDark: "темна",
    colWant: "хочу",
    colPlanned: "планую",
    colHave: "маю",
    categorySuggestions: [
      "мода",
      "дім",
      "краса",
      "техніка",
      "книги",
      "їжа",
      "подорожі",
      "спорт",
    ],
  },
};
