const app = {
  pathToLibsFiles: './assets/libs',
};
window.app = app;

// polyfills
// before polyfills
(function (arr) {
  arr.forEach((item) => {
    if (item.hasOwnProperty('before')) {
      return;
    }
    Object.defineProperty(item, 'before', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function before() {
        // eslint-disable-next-line prefer-rest-params
        const argArr = Array.prototype.slice.call(arguments);
        const docFrag = document.createDocumentFragment();
        argArr.forEach((argItem) => {
          const isNode = argItem instanceof Node;
          docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
        });
        this.parentNode.insertBefore(docFrag, this);
      },
    });
  });
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);

// forEach polyfill
if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = function (callback, thisArg) {
    // eslint-disable-next-line no-param-reassign
    thisArg = thisArg || window;
    for (let i = 0; i < this.length; i++) {
      callback.call(thisArg, this[i], i, this);
    }
  };
}

document.addEventListener('DOMContentLoaded', () => {
  const dataList = document.querySelectorAll('div[data-list]');
  const bw = document.body.clientWidth;

  dataList.forEach((item) => {
    if (bw < 576) {
      item.classList.remove('active');
    }
  });
});

const accordion = () => {
  const main = document.querySelector('.main');
  const contentItem = document.querySelectorAll('.content-item');
  const subContentItem = document.querySelectorAll('.sub-content__item');

  const dataElem = document.querySelectorAll('div[data-search]');
  const dataList = document.querySelectorAll('div[data-list]');

  const searchResultsBlock = document.querySelector('.search-results__block');

  const openFirstLevel = (button, dropdown) => {
    /* eslint-disable-next-line */
    closeDrops();
    button.classList.add('active');
    dropdown.classList.add('active');
  };

  const close = (button, dropdown) => {
    button.classList.remove('active');
    dropdown.classList.remove('active');
  };

  const openSecondLevel = (button, dropdown) => {
    /* eslint-disable-next-line */
    closeSecondLevelDrops();
    button.classList.add('active');
    dropdown.classList.add('active');
  };

  const closeSecondLevelDrops = (button, dropdown) => {
    /* eslint-disable-next-line */
    subContentItem.forEach(item => {
      if (item.children[0] !== button && item.children[1] !== dropdown) {
        close(item.children[0], item.children[1]);
      }
    });
  };

  const closeDrops = (button, dropdown) => {
    /* eslint-disable-next-line */
    contentItem.forEach(item => {
      if (item.children[0] !== button && item.children[1] !== dropdown) {
        close(item.children[0], item.children[1]);
      }
    });

    closeSecondLevelDrops();
  };

  main.addEventListener('click', (e) => {
    /* eslint-disable-next-line */
    const target = e.target;
    /* eslint-disable-next-line */
    determineHeight();
    if (e.target.closest('.search-result')) {
      // searchResultsBlock.style.display = 'none';
      dataElem.forEach((item) => {
        /* eslint-disable-next-line */
        if (item.dataset.search == e.target.dataset.search) {
          item.classList.add('active');
          /* eslint-disable-next-line */
          determineHeight();
        } else {
          item.classList.remove('active');
        }
        dataList.forEach((list) => {
          /* eslint-disable-next-line */
          if (list.dataset.list == e.target.dataset.list) {
            list.classList.add('active');
            list.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
              inline: 'center',
            });
            /* eslint-disable-next-line */
            determineHeight();
          } else {
            list.classList.remove('active');
          }
        });
      });
    }

    if (e.target.closest('.content-title')) {
      const parent = target.closest('.content-item');
      const button = target.closest('.content-title');
      const dropdown = parent.querySelector('.sub-content');
      /* eslint-disable-next-line */
      dropdown.classList.contains('active') ? close(button, dropdown) : openFirstLevel(button, dropdown);
      /* eslint-disable-next-line */
      determineHeight();
    } else if (e.target.closest('.sub-content__title')) {
      const parent = target.closest('.sub-content__item');
      const button = target.closest('.sub-content__title');
      const dropdown = parent.querySelector('.sub-content__description');
      /* eslint-disable-next-line */
      dropdown.classList.contains('active') ? close(button, dropdown) : openSecondLevel(button, dropdown);
      /* eslint-disable-next-line */
      determineHeight();
    }
  });
};

accordion();

const determineHeight = () => {
  const subContent = document.querySelector('.sub-content');
  const content = document.querySelector('.content');

  if (subContent.offsetHeight > content.offsetHeight) {
    /* eslint-disable-next-line */
    content.style.height = subContent.offsetHeight + 100 + 'px';
  }
};

determineHeight();

const searchForm = () => {
  const supportForm = document.querySelector('.support-form');
  const closeForm = document.querySelector('.close-form');
  const supportSearch = document.querySelector('.support-search');
  const searchResultsBlock = document.querySelector('.search-results__block');

  supportForm.addEventListener('keydown', (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  });

  const clearInput = () => {
    supportSearch.value = '';
  };

  supportForm.addEventListener('click', (e) => {
    if (e.target.closest('.support-search')) {
      closeForm.style.display = 'flex';
      closeForm.addEventListener('click', clearInput);
    } else {
      closeForm.style.display = 'none';
      searchResultsBlock.style.display = 'none';
    }
  });
};

searchForm();

const search = () => {
  const searchInput = document.querySelector('.support-search');

  searchInput.addEventListener('input', () => {
    const valueSearch = searchInput.value.trim().toLowerCase();
    const searchResultsBlock = document.querySelector('.search-results__block');

    if (valueSearch.length > 1) {
      searchResultsBlock.style.display = 'block';
      $('#search').hideseek({
        highlight: true,
        hidden_mode: true,
      });
    } else {
      searchResultsBlock.style.display = 'none';
    }
  });
};

search();

const popupImg = () => {
  const imgPopup = document.querySelector('.img-popup');
  const imgPopupImg = document.querySelector('.img-popup__img');

  document.body.addEventListener('click', (e) => {
    if (e.target.closest('.tab-block__img')) {
      imgPopup.style.display = 'flex';
      imgPopupImg.src = e.target.src;
    } else if (e.target.closest('.img-popup')) {
      imgPopup.style.display = 'none';
      imgPopupImg.src = '';
    }
  });
};

popupImg();
