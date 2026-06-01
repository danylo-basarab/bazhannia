export type Lang = "uk" | "en"

type Translations = {
  appName: string
  appSubtitle: string
  namePlaceholder: string
  startButton: string
  signInFooter: string
  signOut: string
  // board
  addColumn: string
  addItem: string
  share: string
  shared: string
  dropHere: string
  deleteColumn: string
  // AddItemDialog
  addToWishlist: string
  editItem: string
  nameLabel: string
  imageUrlLabel: string
  priceLabel: string
  categoryLabel: string
  notesLabel: string
  columnLabel: string
  cancel: string
  saveChanges: string
  addItemBtn: string
  saving: string
  notesPlaceholder: string
  namePlaceholderItem: string
  categoryPlaceholder: string
  // AddColumnDialog
  addColumnTitle: string
  columnNameLabel: string
  columnNamePlaceholder: string
  colorLabel: string
  create: string
  creating: string
  // WishCard
  edit: string
  openImage: string
  delete: string
  bookedBy: string
  // ShareDialog
  shareTitle: string
  sharePublishDesc: string
  sharePublishBtn: string
  publishing: string
  shareLinkDesc: string
  unpublish: string
  unpublishing: string
  // ShareView
  iWillGift: string
  bookTitle: (name: string) => string
  bookDesc: string
  yourName: string
  yourNamePlaceholder: string
  confirm: string
  booking: string
  ownerWishlist: (name: string) => string
  // Theme
  themeLight: string
  themeDark: string
  // Default columns
  colWant: string
  colPlanned: string
  colHave: string
  // Category suggestions
  categorySuggestions: string[]
}

export const translations: Record<Lang, Translations> = {
  en: {
    appName: "Wishlist",
    appSubtitle: "Your personal Pinterest-style scrum board",
    namePlaceholder: "Your name (optional)",
    startButton: "Start my wishlist",
    signInFooter: "Your wishlist is saved to this device. You can always come back.",
    signOut: "Sign out",
    addColumn: "Add column",
    addItem: "Add item",
    share: "Share",
    shared: "Shared",
    dropHere: "Drop items here",
    deleteColumn: "Delete column",
    addToWishlist: "Add to wishlist",
    editItem: "Edit item",
    nameLabel: "Name *",
    imageUrlLabel: "Image URL",
    priceLabel: "Price",
    categoryLabel: "Category",
    notesLabel: "Notes",
    columnLabel: "Column",
    cancel: "Cancel",
    saveChanges: "Save changes",
    addItemBtn: "Add item",
    saving: "Saving…",
    notesPlaceholder: "Any extra details...",
    namePlaceholderItem: "e.g. Linen throw blanket",
    categoryPlaceholder: "e.g. Home, Fashion",
    addColumnTitle: "Add column",
    columnNameLabel: "Column name *",
    columnNamePlaceholder: "e.g. Someday, Gifted",
    colorLabel: "Color",
    create: "Create",
    creating: "Creating…",
    edit: "Edit",
    openImage: "Open image",
    delete: "Delete",
    bookedBy: "Booked by",
    shareTitle: "Share your wishlist",
    sharePublishDesc: "Publish your wishlist to get a shareable link. Friends can view your items and book gifts.",
    sharePublishBtn: "Publish & get link",
    publishing: "Publishing…",
    shareLinkDesc: "Share this link with friends so they can see your wishlist and book gifts.",
    unpublish: "Unpublish",
    unpublishing: "Unpublishing…",
    iWillGift: "I'll gift this",
    bookTitle: (name) => `Book "${name}"`,
    bookDesc: "Let others know you're getting this gift. Your name will be shown on the wishlist.",
    yourName: "Your name",
    yourNamePlaceholder: "e.g. Alice",
    confirm: "Confirm",
    booking: "Booking…",
    ownerWishlist: (name) => `— ${name}'s wishlist`,
    themeLight: "Light",
    themeDark: "Dark",
    colWant: "want",
    colPlanned: "planned",
    colHave: "have",
    categorySuggestions: ["Fashion", "Home", "Beauty", "Tech", "Books", "Food", "Travel", "Sports"],
  },
  uk: {
    appName: "бажання",
    appSubtitle: "Ваша особиста дошка бажань",
    namePlaceholder: "Ваше ім'я (необов'язково)",
    startButton: "Почати",
    signInFooter: "Ваш список збережено на цьому пристрої. Ви завжди можете повернутися.",
    signOut: "Вийти",
    addColumn: "Додати колонку",
    addItem: "Додати бажання",
    share: "Поділитися",
    shared: "Опубліковано",
    dropHere: "Перетягніть сюди",
    deleteColumn: "Видалити колонку",
    addToWishlist: "Нове бажання",
    editItem: "Редагувати",
    nameLabel: "Назва *",
    imageUrlLabel: "Посилання на фото",
    priceLabel: "Ціна",
    categoryLabel: "Категорія",
    notesLabel: "Нотатки",
    columnLabel: "Колонка",
    cancel: "Скасувати",
    saveChanges: "Зберегти",
    addItemBtn: "Додати",
    saving: "Збереження…",
    notesPlaceholder: "Додаткові деталі...",
    namePlaceholderItem: "напр. Лляний плед",
    categoryPlaceholder: "напр. Дім, Мода",
    addColumnTitle: "Нова колонка",
    columnNameLabel: "Назва *",
    columnNamePlaceholder: "напр. Колись, Подаровано",
    colorLabel: "Колір",
    create: "Створити",
    creating: "Створення…",
    edit: "Редагувати",
    openImage: "Відкрити фото",
    delete: "Видалити",
    bookedBy: "Забронював(ла)",
    shareTitle: "Поділитися списком",
    sharePublishDesc: "Опублікуйте список, щоб отримати посилання. Друзі зможуть переглянути ваші бажання та зарезервувати подарунки.",
    sharePublishBtn: "Опублікувати",
    publishing: "Публікація…",
    shareLinkDesc: "Поділіться цим посиланням з друзями, щоб вони побачили ваш список.",
    unpublish: "Приховати",
    unpublishing: "Приховання…",
    iWillGift: "Я подарую це",
    bookTitle: (name) => `Забронювати «${name}»`,
    bookDesc: "Повідомте інших, що ви купуєте цей подарунок. Ваше ім'я буде показано у списку.",
    yourName: "Ваше ім'я",
    yourNamePlaceholder: "напр. Аліса",
    confirm: "Підтвердити",
    booking: "Бронювання…",
    ownerWishlist: (name) => `— список бажань ${name}`,
    themeLight: "Світла",
    themeDark: "Темна",
    colWant: "хочу",
    colPlanned: "планую",
    colHave: "маю",
    categorySuggestions: ["Мода", "Дім", "Краса", "Техніка", "Книги", "Їжа", "Подорожі", "Спорт"],
  },
}
