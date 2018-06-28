import React, { Component } from 'react';
import { ScrollView, View } from 'react-native';
import PropTypes from 'prop-types';
import {
  Body,
  Button,
  Container,
  Content,
  Header,
  Icon,
  Input,
  Item,
  Left,
  List,
  ListItem,
  Right,
  Separator,
  Spinner,
  Text,
  Thumbnail,
} from 'native-base';

class LinkFriend extends Component {
  static propTypes = {
    onPlayerSelected: PropTypes.func.isRequired,
    searchText: PropTypes.string,
  }

  static defaultProps = {
    searchText: null,
  }

  state = {
    searchText: this.props.searchText,
    loading: false,
    results: null,
    notFound: null,
  };

  search = async () => {
    //  Start the loading spinner...
    this.setState({
      ...this.state,
      loading: true,
      results: null,
      notFound: null,
    });

    //  Hit the search API.
    const { searchText } = this.state;
    try {
      const response = await fetch(`https://us-central1-gameboard-560d5.cloudfunctions.net/api/search-users?q=${searchText}`);
      const { status } = response;

      //  For a 404, we show not found.
      if (status === 404) {
        this.setState({
          ...this.state,
          loading: false,
          results: null,
          notFound: true,
        });
      }

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

      const player = await response.json();
      const results = [{
        uid: player.uid,
        name: player.displayName,
        email: player.email,
        imageUri: player.photoURL,
      }];
      this.setState({ ...this.state, loading: false, results });
    } catch (err) {
      //  TODO proper error handling.
      this.setState({
        ...this.state,
        loading: false,
        error: true,
        results: null,
      });
    }
  }


  renderSearchResults = () => {
    if (!this.state.results) return null;

    return (
      <View>
        <Separator bordered>
          <Text>Search Results</Text>
        </Separator>
        { this.state.results.map(this.renderPlayer) }
      </View>
    );
  }

  renderPlayer = player => (
    <ListItem
      key={player.uid}
      onPress={() => this.props.onPlayerSelected(player)}
      avatar
      button
    >
      <Left>
        <Thumbnail small source={{ uri: player.imageUri }} />
      </Left>
      <Body>
        <Text>{player.name}</Text>
      </Body>
      <Right>
        <Icon name="arrow-forward" />
      </Right>
    </ListItem>
  )

  render = () => (
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
            { this.state.loading && <Spinner /> }
            { this.renderSearchResults() }
            { this.state.notFound && <Text>Player not found</Text> }
          </List>
        </Content>
      </ScrollView>
    </Container>
  )
}

export default LinkFriend;
