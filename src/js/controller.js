import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { MODAL_CLOSE_SEC } from './config.js';

import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

class Controller {
  constructor() {
    this.init();
  }

  async controlRecipes() {
    try {
      const id = window.location.hash.slice(1);

      if (!id) return;
      recipeView.renderSpinner();

      resultsView.update(model.getSearchResultsPage());
      bookmarksView.update(model.state.bookmarks);

      await model.loadRecipe(id);

      recipeView.render(model.state.recipe);
    } catch (err) {
      recipeView.renderError();
      console.error(err);
    }
  }

  async controlSearchResults() {
    try {
      resultsView.renderSpinner();
      const query = searchView.getQuery();
      if (!query) return;

      await model.loadSearchResults(query);
      resultsView.render(model.getSearchResultsPage());

      paginationView.render(model.state.search);
    } catch (error) {
      console.log(error);
    }
  }

  controlPagination(goToPage) {
    resultsView.render(model.getSearchResultsPage(goToPage));

    paginationView.render(model.state.search);
  }

  controlServings(newServings) {
    model.updateServings(newServings);
    recipeView.update(model.state.recipe);
  }

  controlAddBookmark() {
    if (!model.state.recipe.bookmarked) {
      model.addBookmark(model.state.recipe);
    } else {
      model.deleteBookmark(model.state.recipe.id);
    }

    recipeView.update(model.state.recipe);
    bookmarksView.update(model.state.bookmarks);

    bookmarksView.render(model.state.bookmarks);
  }

  controlBookmarks() {
    bookmarksView.render(model.state.bookmarks);
  }

  async controlAddRecipe(newRecipe) {
    try {
      addRecipeView.renderSpinner();
      await model.uploadRecipe(newRecipe);
      console.log(model.state.recipe);

      recipeView.render(model.state.recipe);

      addRecipeView.renderMessage();

      bookmarksView.render(model.state.bookmarks);

      window.history.pushState(null, '', `#${model.state.recipe.id}`);

      setTimeout(() => {
        addRecipeView.toggleWindow();
      }, MODAL_CLOSE_SEC * 1000);
    } catch (error) {
      console.log('*******', error);
      addRecipeView.renderError(error.message);
    }
  }

  init() {
    recipeView.addHandlerRender(this.controlRecipes.bind(this));
    recipeView.addHandlerUpdateServings(this.controlServings.bind(this));
    recipeView.addHandlerAddBookmark(this.controlAddBookmark.bind(this));
    searchView.addHandlerSearch(this.controlSearchResults.bind(this));
    bookmarksView.addHandlerRender(this.controlBookmarks.bind(this));
    paginationView.addHandlerClick(this.controlPagination.bind(this));
    addRecipeView.addHandlerUpload(this.controlAddRecipe.bind(this));
  }
}

export default new Controller();
