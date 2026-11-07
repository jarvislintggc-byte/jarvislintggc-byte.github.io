(() => {
  'use strict';
  const cache = new Map();
  const languages = new Set(['en', 'zh-Hant', 'ja']);
  function load(language, id = 'index') {
    if (!languages.has(language) || !/^[a-z0-9-]+$/.test(id)) return Promise.reject(new Error('Unknown article'));
    const url = `/articles/${language}/${id}.json?v=7858d5b8674fda7b`;
    if (!cache.has(url)) cache.set(url, fetch(url).then(response => {
      if (!response.ok) throw new Error(`Article unavailable (${response.status})`);
      return response.json();
    }).catch(error => { cache.delete(url); throw error; }));
    return cache.get(url);
  }
  window.JarvisArticles = {index: language => load(language), article: load};
})();
