export const API_URL = {
    // запуск именно легких моделей
    LaunchModelAI: () => '/model/launch',
    KillModelAI: () => '/model/kill',
    DeleteModelAI: () => '/model/delete', // полностью удаляет модель из памяти

    // получение активной модели
    GetActiveModel: () => '/model/getactive',

    // получение вообще всех моделей 
    GetAllModels: () => '/model/getavailabletodownload',

    // проверка на тяжелую модель
    CheckHeavyModel: () => '/model/ismodelheavy',


    // генерации 
    GenerateOnlyText: () => '/generate/fromtext',
    GenerateFromImageText: () => '/generate/fromimagetext',
    GenerateImageFromText: () => '/generate/imagefromtext',
    GenerateTextToSpeech: () => '/generate/texttospeech',
    GenerateSpeechToText: () => '/generate/speechtotext',

    // Взимодейтствие с чатом и моделью
    ClearChat: () => '/chat/clearchat',
    AddSystemPrompt: () => '/chat/addsystemprompt',
    UpdateModel: () => '/chat/updatemodelchat',
    GetChat: () => '/chat/getchathistory',
    ClearChatHistory: () => '/chat/clearchat',


    // запуск тяжелых моделей
    LaunchHeavyModel: () => '/heavy/model/launch',
    GenerateImgFromText: () => '/heavy/generate/imagefromtext',

}
