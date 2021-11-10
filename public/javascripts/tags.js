function TagsInput(element) {
  let self = this;
  let initChar = "\u200B";
  let initCharPattern = new RegExp(initChar, 'g');

  let insert = function (element) {
    if (self.textNode) self.element.insertBefore(element, self.textNode);
    else self.element.appendChild(element);
  };

  let updateCursor = function () {
    self.cursor = self.blank;
  };

  let keydown = function (event) {
    if (event.keyCode == 188) {
      event.preventDefault();
      setTimeout(function () {
        let text = self.text;
        if (text) {
          self.text = initChar;
          self.add(text);
        }
      }, 1);
    }
    else if (event.keyCode == 8) {
      if (self.text.replace(initCharPattern, '') == '') {
        self.text = initChar + initChar;
        if (self.selected) {
          self.element.removeChild(self.selected);
        }
        else {
          let tags = self.tags;
          let keys = Object.keys(tags)
          if (keys.length > 0) {
            let tag = tags[keys[keys.length - 1]];
            tag.setAttribute('data-selected', '');
          }
        }
      }
    }

    if (event.keyCode !== 8) {
      if (self.selected) self.selected.removeAttribute('data-selected');
    }
    setTimeout(function () {
      updateCursor();
    }, 1);
  };

  let focus = function () {
    updateCursor();
  };

  Object.defineProperties(this, {
    element: {
      get: function () {
        return element;
      },
      set: function (v) {
        if (typeof v == 'string') v = document.querySelector(v);
        element = v instanceof Node ? v : document.createElement('div');
        if (!element.className.match(/\btags-input\b/))
          element.className += ' tags-input';
        if (element.getAttribute('contenteditable') != 'true')
          element.setAttribute('contenteditable', 'true');

        element.removeEventListener('keydown', keydown);
        element.addEventListener('keydown', keydown);

        element.removeEventListener('focus', focus);
        element.addEventListener('focus', focus);
        this.text = initChar;
      }
    },
    tags: {
      get: function () {
        let element;
        let elements = this.element.querySelectorAll('span');
        let tags = {};
        for (let i = 0; i < elements.length; i++) {
          element = elements[i]
          tags[element.innerText] = element;
        }

        return tags;
      }
    },
    lastChild: {
      get: function () {
        return this.element.lastChild;
      }
    },
    textNode: {
      get: function () {
        return this.element.lastChild instanceof Text ? this.element.lastChild : null;
      }
    },
    text: {
      get: function () {
        return this.textNode ? this.textNode.data : null;
      },
      set: function (v) {
        if (!this.textNode) this.element.appendChild(document.createTextNode(','));
        this.textNode.data = v;
      },
    },
    cursor: {
      get: function () {
        return this.element.getAttribute('data-cursor') !== null;
      },
      set: function (v) {
        if (v) this.element.setAttribute('data-cursor', '');
        else this.element.removeAttribute('data-cursor');
      }
    },
    focused: {
      get: function () {
        return document.activeElement == this.element;
      }
    },
    blank: {
      get: function () {
        return this.text.replace(initCharPattern, '') == '';
      }
    },
    selected: {
      get: function () {
        return this.element.querySelector('span[data-selected]');
      }
    }
  });

  this.add = function (tag) {
    tag = tag.replace(initCharPattern, '');
    tag = tag.replace(/^\s+/, '').replace(/\s+$/, '');
    if (tag != '' && this.tags[tag] === undefined) {
      let element = document.createElement('span');
      element.appendChild(document.createTextNode(tag));
      element.setAttribute('contenteditable', 'false');

      insert(element);
    }
  };

  this.remove = function (tag) {
    let element = this.tags[tag];
    if (element) this.element.removeChild(element);
  };

  this.element = element;
};
