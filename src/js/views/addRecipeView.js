import View from './view';
import icons from 'url:../../img/icons.svg';
import FilePond from 'filepond';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import { FilePondPluginImagePreview } from 'filepond-plugin-image-preview';
import { FilePondPluginFileValidateType } from 'filepond-plugin-file-validate-type';

class AddRecipeView extends View {
  constructor() {
    super();
    this._mainElement = document.querySelector('.upload');
    this._successMessage = 'Recipe was successfully uploaded';
    this._popupWindow = document.querySelector('.add-recipe-window');
    this._screenOverlay = document.querySelector('.overlay');
    this._openButton = document.querySelector('.nav__btn--add-recipe');
    this._closeButton = document.querySelector('.btn--close-modal');

    this._setupShowWindowHandler();
    this._setupHideWindowHandler();

    FilePond.registerPlugin(FilePondPluginImagePreview, FilePondPluginFileValidateType);

    this._filePond = FilePond.create(document.querySelector('input.filepond'), {
      allowMultiple: false,
      maxFiles: 1,
      acceptedFileTypes: ['image/*'],
      imagePreviewHeight: 200,
      labelIdle: 'Drag & Drop your image or <span class="filepond--label-action">Browse</span>'
    });
  }

  get mainElement() {
    return this._mainElement;
  }

  set mainElement(element) {
    if (element instanceof HTMLElement) {
      this._mainElement = element;
    } else {
      throw new Error('Invalid element type. Expected an HTMLElement.');
    }
  }

  get successMessage() {
    return this._successMessage;
  }

  set successMessage(message) {
    if (typeof message === 'string') {
      this._successMessage = message;
    } else {
      throw new Error('Invalid message type. Expected a string.');
    }
  }

  get popupWindow() {
    return this._popupWindow;
  }

  set popupWindow(element) {
    if (element instanceof HTMLElement) {
      this._popupWindow = element;
    } else {
      throw new Error('Invalid element type. Expected an HTMLElement.');
    }
  }

  get screenOverlay() {
    return this._screenOverlay;
  }

  set screenOverlay(element) {
    if (element instanceof HTMLElement) {
      this._screenOverlay = element;
    } else {
      throw new Error('Invalid element type. Expected an HTMLElement.');
    }
  }

  get openButton() {
    return this._openButton;
  }

  set openButton(element) {
    if (element instanceof HTMLElement) {
      this._openButton = element;
    } else {
      throw new Error('Invalid element type. Expected an HTMLElement.');
    }
  }

  get closeButton() {
    return this._closeButton;
  }

  set closeButton(element) {
    if (element instanceof HTMLElement) {
      this._closeButton = element;
    } else {
      throw new Error('Invalid element type. Expected an HTMLElement.');
    }
  }

  togglePopup() {
    this._screenOverlay.classList.toggle('hidden');
    this._popupWindow.classList.toggle('hidden');
  }

  _setupShowWindowHandler() {
    this._openButton.addEventListener('click', this.togglePopup.bind(this));
  }

  _setupHideWindowHandler() {
    this._screenOverlay.addEventListener('click', this.togglePopup.bind(this));
    this._closeButton.addEventListener('click', this.togglePopup.bind(this));
  }

  setupUploadHandler(handler) {
    this._mainElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const formData = new FormData(this);
      
      formData.append('image', this._filePond.getFile()?.file);

      const formObject = {};
      formData.forEach((value, key) => {
        formObject[key] = value;
      });

      handler(formObject);
    });
  }

  _generateMarkup() {}
}

export default new AddRecipeView();
