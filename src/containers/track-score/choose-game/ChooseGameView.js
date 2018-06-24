import React, { Component } from 'react';
import { ScrollView, View } from 'react-native';
import { connect } from 'react-redux';
import {
  Container,
  Content,
  Spinner,
  Header,
  Item,
  Input,
  Icon,
  Left,
  Body,
  Right,
  Separator,
  List,
  ListItem,
  Button,
  Text,
} from 'native-base';
import PropTypes from 'prop-types';
import firebase from 'react-native-firebase';

const renderGame = (game) => {
  const {
    id,
    name,
    isFavourite,
    onFavourite,
    onSelect,
  } = game;
  return (
    <ListItem
      key={id}
      icon
      button
      onPress={onSelect}
    >
      <Left>
        <Button onPress={onFavourite} transparent>
          { isFavourite
              ? <Icon name="md-star" />
              : <Icon name="md-star-outline" />
          }

        </Button>
      </Left>
      <Body>
        <Text>{name}</Text>
      </Body>
      <Right>
        <Icon name="arrow-forward" />
      </Right>
    </ListItem>
  );
};

class WhatGame extends Component {
  static componentName = 'WhatGame';

  static propTypes = {
    favouriteGames: PropTypes.arrayOf(PropTypes.object).isRequired,
    recentGames: PropTypes.arrayOf(PropTypes.object).isRequired,

    //  Called when the user selects a game.
    onSelectGame: PropTypes.func.isRequired,
  }

  static defaultProps = {
  }

  state = {
    loading: false,
    searchText: null,
    results: null,
  };

  search = async () => {
    console.log(`Search: ${this.state.searchText}`);
    this.setState({ ...this.state, loading: true });

    //  Hit the search API.
    const safeSearch = this.state.searchText.replace(' ', '+');
    try {
      const response = await fetch(`https://us-central1-gameboard-560d5.cloudfunctions.net/api/search?q=${safeSearch}`);
      const { status } = response;

      //  If we don't have a valid status, set the error.
      if (status !== 200) {
        this.setState({
          ...this.state,
          loading: false,
          error: true,
          results: null,
        });
        return;
      }

      //  We've got a response, add each result to the list.
      const data = await response.json();
      const results = data.map(d => d);
      this.setState({ ...this.state, loading: false, results });
    } catch (err) {
      //  TODO error toast.
      this.setState({
        ...this.state,
        loading: false,
        error: true,
        results: null,
      });
    }
  }

  toggleFavourite = (game) => {
    const {
      uid,
    } = firebase.auth().currentUser;

    const add = this.props.favouriteGames.some(fg => fg.id === game.id) === false;

    firebase.firestore()
      .collection('users')
      .doc(uid)
      .update({
        favouriteGames: add
          ? [...this.props.favouriteGames, game]
          : [...this.props.favouriteGames.filter(fg => fg.id !== game.id)],
      });
  }

  renderRecent = (recent) => {
    if (!recent) return null;

    return (
      <View>
        <Separator bordered>
          <Text>Recent</Text>
        </Separator>
        {recent.map(game => renderGame({
          id: game.id,
          name: game.name,
          isFavourite: true,
          onFavourite: () => this.toggleFavourite(game),
          onSelect: () => this.props.onSelectGame(game),
        })) }
      </View>
    );
  }

  renderFavourites = (favourites) => {
    if (!favourites) return null;
    return (
      <View>
        <Separator bordered>
          <Text>Favourites</Text>
        </Separator>
        {favourites.map(game => renderGame({
          id: game.id,
          name: game.name,
          isFavourite: true,
          onFavourite: () => this.toggleFavourite(game),
          onSelect: () => this.props.onSelectGame(game),
        })) }
      </View>
    );
  }

  renderResults = (results, loading) => {
    if (!results && !loading) return null;
    return (
      <View>
        <Separator bordered>
          <Text>Results</Text>
        </Separator>
        { loading && <Spinner /> }
        { results && results.map(game => renderGame({
          id: game.id,
          name: game.name,
          onFavourite: () => this.toggleFavourite(game),
          onSelect: () => this.props.onSelectGame(game),
        })) }
      </View>
    );
  }

  renderError = () => {
    if (!this.state.error) return null;
    return <Text>An error occured: {this.state.error}</Text>;
  }

  render = () => {
    const { favouriteGames, recentGames } = this.props;
    const { results, loading } = this.state;

    return (
      <Container>
        <Header searchBar rounded>
          <Item>
            <Icon name="ios-search" />
            <Input
              placeholder="Search"
              onChangeText={searchText => this.setState({ ...this.state, searchText })}
              value={this.state.searchText}
            />
            <Icon name="ios-people" />
          </Item>
          <Button transparent onPress={() => this.search()}>
            <Text>Search</Text>
          </Button>
        </Header>
        <ScrollView>
          <Content>
            <List>
              { this.renderResults(results, loading) }
              { this.renderFavourites(favouriteGames) }
              { this.renderRecent(recentGames) }
            </List>
            { this.renderError() }
          </Content>
        </ScrollView>
      </Container>
    );
  }
}

function mapStateToProps(state) {
  //  Get the recent games.
  const recentGameIds = [];
  const recentGames = [];
  state.history.playedGames.forEach((playedGame) => {
    const { id, name } = playedGame.game;
    if (recentGameIds.indexOf(id) !== -1 || id === undefined) return;
    recentGameIds.push(id);
    recentGames.push({ id, name });
  });

  return {
    favouriteGames: state.user.favouriteGames,
    recentGames,
  };
}

export default connect(mapStateToProps)(WhatGame);
