
### интернационализация

на проекте всегда тексты должны быть обернуты в useTranslation и покрываться t() чтобы перевод работал, при создании новой страницы нужно создавать в папке public/locales рядом с translation.json новый файл 
MainPage.json - куда в итоге вносятся ключи для перевода, чтобы это сработало нужно,
 чтобы в компоненте вы добавили название. Вот пример 



```typescript
const { t } = useTranslation('Projects')
```

пример шаблонного компонента 

```typescript
import { useTranslation } from 'react-i18next';

export const component = observer(() => {
    const { t } = useTranslation('about');
  
    return (
        <div>
            {t('О сайте')}
        </div>

    );

});

export default component;
```
