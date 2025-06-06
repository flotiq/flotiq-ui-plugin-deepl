import i18n from 'i18next';

i18n.init({
  fallbackLng: 'en',
  supportedLngs: ['en', 'pl'],
  resources: {
    en: {
      translation: {
        ContentType: 'Content Type',
        DefaultLanguage: 'Default language',
        DeeplApiKey: 'DeepL API Key',
        FieldRequired: 'Field is required',
        Fields: 'Content type fields to translate',
        Languages: 'Available languages',
        MinLanguages: 'You have to add at least 2 languages',
        Warning: 'Warning!',
        WrongField:
          'This field type is not supported or content type does not have this field',
        Success: 'Translating content succeeded',
        TranslationError: 'Error translating content',
        MultilingualConfigError: 'Multilingual plugin settings not found',
      },
    },
    pl: {
      translation: {
        ContentType: 'Typ zawartości',
        DefaultLanguage: 'Domyślny język',
        DeeplApiKey: 'Klucz API do DeepL',
        FieldRequired: 'Pole jest wymagane',
        Fields: 'Pola typu zawartości do przetłumaczenia',
        Languages: 'Dostępne języki',
        MinLanguages: 'Musisz dodać co najmniej dwa języki',
        Warning: 'Uwaga!',
        WrongField:
          'Ten typ pola nie jest wspierany lub typ zawartości już go nie zawiera',
        Success: 'Tłumaczenie zawartości zakończono sukcesem',
        TranslationError: 'Wystąpił błąd podczas tłumaczenia zawartości',
        MultilingualConfigError: 'Nie znaleziono ustawień wtyczki Multilingual',
      },
    },
  },
});

export default i18n;
