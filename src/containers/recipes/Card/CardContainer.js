/**
 * Individual Recipe Card Container
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

// Actions
import * as RecipeActions from '@redux/recipes/actions';

// Components
import RecipeCardRender from './CardView';

/* Redux ==================================================================== */
// What data from the store shall we send to the component?
const mapStateToProps = state => ({
  user: state.user,
  favourites: (state.recipe && state.recipe.favourites) ? state.recipe.favourites : null,
});

// Any actions to map to the component?
const mapDispatchToProps = {
  updateFavourites: RecipeActions.updateFavourites,
};

/* Component ==================================================================== */
class RecipeCard extends Component {
  static componentName = 'RecipeCard';

  static propTypes = {
    recipe: PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      body: PropTypes.string.isRequired,
      image: PropTypes.string,
    }).isRequired,
    updateFavourites: PropTypes.func.isRequired,
    favourites: PropTypes.arrayOf(PropTypes.number),
    user: PropTypes.shape({
      localId: PropTypes.string,
    }),
  }

  static defaultProps = {
    favourites: null,
    user: null,
  }

  constructor(props) {
    super(props);
    this.state = { recipe: props.recipe };
  }

  componentWillReceiveProps(props) {
    if (props.recipe) {
      this.setState({ recipe: props.recipe });
    }
  }

  /**
    * On Press of Card
    */
  onPressCard = () => {
    Actions.recipeView({
      title: this.props.recipe.title,
      recipe: this.props.recipe,
    });
  }

  /**
    * When user taps to favourite a recipe
    */
  onPressFavourite = () => {
    if (this.props.user && this.props.user.localId) {
      const recipeId = this.props.recipe.id;

      if (recipeId && this.props.updateFavourites) {
        const favs = this.props.favourites;

        // Toggle to/from current list
        if (this.isFavourite()) {
          favs.splice(favs.indexOf(this.props.recipe.id), 1);
        } else {
          favs.push(recipeId);
        }

        // Send new list to API
        this.props.updateFavourites(this.props.user.localId, favs);
      }
    }
  }


  /**
    * Check in Redux to find if this Recipe ID is a Favourite
    */
  isFavourite = () => {
    const { favourites, recipe } = this.props;

    if (recipe && recipe.id && favourites) {
      if (favourites.indexOf(recipe.id) > -1) return true;
    }

    return false;
  }

  render = () => {
    const { recipe } = this.state;
    const { user } = this.props;

    return (
      <RecipeCardRender
        title={recipe.title}
        body={recipe.body}
        image={recipe.image}
        onPress={this.onPressCard}
        onPressFavourite={(user && user.localId) ? this.onPressFavourite : null}
        isFavourite={(user && user.localId && this.isFavourite()) && true}
      />
    );
  }
}

/* Export Component ==================================================================== */
export default connect(mapStateToProps, mapDispatchToProps)(RecipeCard);