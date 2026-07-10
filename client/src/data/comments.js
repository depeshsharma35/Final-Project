// Sample comments data (from Task 6)
export const LANGUAGES = {
  en: 'English', es: 'Spanish', fr: 'French', de: 'German',
  ja: 'Japanese', zh: 'Chinese', pt: 'Portuguese', ko: 'Korean', ar: 'Arabic'
};

export const REGIONS = [
  'North America', 'South America', 'Western Europe', 'Central Europe', 'Eastern Europe',
  'East Asia', 'South Asia', 'Southeast Asia', 'Middle East', 'Africa', 'Oceania'
];

export const AVATAR_COLORS = [
  '#B45309', '#9F1239', '#0E7490', '#4338CA', '#7C3AED',
  '#BE185D', '#047857', '#B91C1C', '#1D4ED8', '#A16207'
];

export const ABUSIVE = [
  'stupid', 'idiot', 'moron', 'dumb', 'loser', 'trash', 'garbage', 'fool', 'crap',
  'damn', 'bastard', 'pathetic', 'worthless', 'disgusting', 'shut up',
  'prick', 'scum', 'imbecile', 'cretin', 'twat', 'wanker'
];

export const SAMPLE_COMMENTS = [
  {
    id: 1, videoId: 'bunny-2024', username: "Carlos Méndez", lang: "es",
    text: "Este artículo es increíble. Me ha ayudado mucho a entender los conceptos básicos de la programación funcional.",
    translations: {
      en: "This article is incredible. It has helped me a lot to understand the basic concepts of functional programming. Could you do a follow-up on monads?",
      fr: "Cet article est incroyable. Il m'a beaucoup aidé à comprendre les concepts de base de la programmation fonctionnelle.",
      de: "Dieser Artikel ist unglaublich. Er hat mir sehr geholfen, die Grundkonzepte der funktionalen Programmierung zu verstehen.",
      ja: "この記事は素晴らしいです。関数型プログラミングの基本概念を理解するのにとても役立ちました。",
      zh: "这篇文章太棒了。它帮助我理解了函数式编程的基本概念。"
    },
    location: "Latin America", showLocation: true, ts: Date.now() - 2 * 3600000, likes: 24, dislikes: 1, reports: 0, flagged: false
  },
  {
    id: 2, videoId: 'bunny-2024', username: "Marie Dubois", lang: "fr",
    text: "Très bon point de vue ! Je suis totalement d'accord sur l'importance de la lisibilité du code. Cependant, j'aurais aimé voir plus d'exemples pratiques.",
    translations: {
      en: "Very good point of view! I totally agree on the importance of code readability. However, I would have liked to see more practical examples in this tutorial.",
      es: "¡Muy buen punto de vista! Estoy totalmente de acuerdo en la importancia de la legibilidad del código.",
      de: "Sehr guter Standpunkt! Ich stimme der Bedeutung der Code-Lesbarkeit voll zu.",
      ja: "とても良い視点です！コードの読みやすさの重要性には完全に同意します。",
      zh: "很好的观点！我完全同意代码可读性的重要性。"
    },
    location: "Western Europe", showLocation: true, ts: Date.now() - 5 * 3600000, likes: 18, dislikes: 0, reports: 0, flagged: false
  },
  {
    id: 3, videoId: 'bear-country', username: "田中太郎", lang: "ja",
    text: "このチュートリアルは初心者にもわかりやすくて素晴らしいです。次は非同期処理についても解説してほしいですね。",
    translations: {
      en: "This tutorial is easy to understand even for beginners and is wonderful. I'd like you to also explain asynchronous processing next.",
      es: "Este tutorial es fácil de entender incluso para principiantes. Me gustaría que también explicaran el procesamiento asíncrono.",
      fr: "Ce tutoriel est facile à comprendre même pour les débutants. J'aimerais que vous expliquiez aussi le traitement asynchrone.",
      de: "Dieses Tutorial ist auch für Anfänger leicht verständlich. Ich würde wünschen, dass Sie asynchrone Verarbeitung erklären.",
      zh: "这个教程对初学者来说也很容易理解。希望下次也能讲解异步处理。"
    },
    location: "East Asia", showLocation: true, ts: Date.now() - 12 * 3600000, likes: 31, dislikes: 2, reports: 0, flagged: false
  },
  {
    id: 4, videoId: 'bunny-2024', username: "James Mitchell", lang: "en",
    text: "Solid explanation of the fundamentals. One thing I'd add is that immutability isn't just about preventing bugs — it also enables better optimization in modern compilers. Great work overall!",
    translations: {},
    location: "North America", showLocation: false, ts: Date.now() - 86400000, likes: 42, dislikes: 3, reports: 0, flagged: false
  },
  {
    id: 5, videoId: 'bear-country', username: "Anna Schmidt", lang: "de",
    text: "Endlich einmal eine Erklärung, die nicht nur Theorie ist, sondern auch zeigt, wie man es in der Praxis anwendet. Das Beispiel mit der Liste war besonders hilfreich.",
    translations: {
      en: "Finally an explanation that's not just theory but also shows how to apply it in practice. The example with the list was especially helpful.",
      es: "Por fin una explicación que no es solo teoría sino que también muestra cómo aplicarla en la práctica.",
      fr: "Enfin une explication qui n'est pas que de la théorie mais qui montre aussi comment l'appliquer en pratique.",
      ja: "ついに理論だけではなく、実践でどう応用するかを示した説明が出ました。",
      zh: "终于有一个不只是理论，还展示了如何在实践中应用的解释了。"
    },
    location: "Central Europe", showLocation: true, ts: Date.now() - 2 * 86400000, likes: 15, dislikes: 0, reports: 0, flagged: false
  },
  {
    id: 6, videoId: 'flower-bloom', username: "王小明", lang: "zh",
    text: "写得很好！不过我想补充一点，在实际项目中，完全的函数式编程可能会带来性能问题。建议在合适的地方灵活运用。",
    translations: {
      en: "Well written! But I'd like to add that in real projects, pure functional programming might bring performance issues. I suggest using it flexibly where appropriate.",
      es: "¡Bien escrito! Pero me gustaría añadir que en proyectos reales, la programación funcional pura podría traer problemas de rendimiento.",
      fr: "Bien écrit ! Mais j'aimerais ajouter que dans les projets réels, la programmation fonctionnelle pure pourrait apporter des problèmes de performance.",
      de: "Gut geschrieben! Aber ich möchte hinzufügen, dass in echten Projekten reine funktionale Programmierung Leistungsprobleme bringen könnte.",
      ja: "よく書かれています！ただ、実際のプロジェクトでは純粋な関数型プログラミングがパフォーマンスの問題を引き起こす可能性があります。"
    },
    location: "East Asia", showLocation: true, ts: Date.now() - 3 * 86400000, likes: 27, dislikes: 1, reports: 0, flagged: false
  },
  {
    id: 7, videoId: 'flower-bloom', username: "Lucas Oliveira", lang: "pt",
    text: "Excelente conteúdo! Aqui no Brasil estamos precisando de mais materiais assim em português. Vou compartilhar com meus colegas de trabalho.",
    translations: {
      en: "Excellent content! Here in Brazil we need more materials like this in Portuguese. I'll share it with my coworkers.",
      es: "¡Excelente contenido! Aquí en Brasil necesitamos más materiales así en portugués.",
      fr: "Excellent contenu ! Ici au Brésil, nous avons besoin de plus de matériel comme celui-ci en portugais.",
      de: "Ausgezeichneter Inhalt! Hier in Brasilien brauchen wir mehr Materialien wie diese auf Portugiesisch.",
      ja: "素晴らしいコンテンツです！ブラジルではポルトガル語でこのような資料がもっと必要です。",
      zh: "优秀的内容！在巴西，我们需要更多这样的葡萄牙语材料。"
    },
    location: "South America", showLocation: true, ts: Date.now() - 4 * 86400000, likes: 19, dislikes: 0, reports: 1, flagged: false
  },
  {
    id: 8, videoId: 'bunny-2024', username: "PromoKing", lang: "en",
    text: "This is just another generic article that says nothing new. I've seen this exact same content reposted across at least five different sites this month.",
    translations: {},
    location: null, showLocation: false, ts: Date.now() - 1800000, likes: 0, dislikes: 8, reports: 2, flagged: true
  }
];
