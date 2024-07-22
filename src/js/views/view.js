import icons from 'url:../../img/icons.svg'; // Parcel 2

function View() {
  this._data = null;
}

View.prototype.render = function (data, render = true) {
  if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError();

  this._data = data;
  const markup = this._generateMarkup();

  if (!render) return markup;

  this._clear();
  this._parentElement.insertAdjacentHTML('afterbegin', markup);
};

View.prototype.update = function (data) {
  this._data = data;
  const newMarkup = this._generateMarkup();

  const newDOM = document.createRange().createContextualFragment(newMarkup);
  const newElements = Array.from(newDOM.querySelectorAll('*'));
  const curElements = Array.from(this._parentElement.querySelectorAll('*'));

  newElements.forEach((newEl, i) => {
    const curEl = curElements[i];

    // Updates changed TEXT
    if (
      !newEl.isEqualNode(curEl) &&
      newEl.firstChild?.nodeValue.trim() !== ''
    ) {
      curEl.textContent = newEl.textContent;
    }

    // Updates changed ATTRIBUTES
    if (!newEl.isEqualNode(curEl))
      Array.from(newEl.attributes).forEach(attr =>
        curEl.setAttribute(attr.name, attr.value)
      );
  });
};

View.prototype._clear = function () {
  this._parentElement.innerHTML = '';
};

View.prototype.renderSpinner = function () {
  const markup = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>
  `;
  this._clear();
  this._parentElement.insertAdjacentHTML('afterbegin', markup);
};

View.prototype.renderError = function (message = this._errorMessage) {
  const markup = `
    <div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
  `;
  this._clear();
  this._parentElement.insertAdjacentHTML('afterbegin', markup);
};

View.prototype.renderMessage = function (message = this._message) {
  const markup = `
    <div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
  `;
  this._clear();
  this._parentElement.insertAdjacentHTML('afterbegin', markup);
};

// Ось приклад, як створити новий об'єкт на основі прототипу:
const viewInstance = Object.create(View.prototype);
viewInstance._parentElement = document.querySelector('.parent-element'); // наприклад
viewInstance._errorMessage = 'An error occurred';
viewInstance._message = 'Operation successful';
