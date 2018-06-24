//  ThumbnailLink
//
//  Extends the native-base thumbnail with support for a fallback 'unknown'
//  image if the uri is falsey. Also allows for a onPress event.
import React from 'react';
import { TouchableHighlight } from 'react-native';
import PropTypes from 'prop-types';
import { Thumbnail } from 'native-base';

const ThumbnailLink = (props) => {
  const { onPress, uri, ...other } = props;

  //  If we don't have URI, we fallback on the unknown image.
  const source = uri
    ? { uri }
    : require('../../images/unknown.png');
  return (
    <TouchableHighlight onPress={onPress}>
      <Thumbnail
        source={source}
        {...other}
      />
    </TouchableHighlight>
  );
};

ThumbnailLink.propTypes = {
  onPress: PropTypes.func,
  uri: PropTypes.string,
};

ThumbnailLink.defaultProps = {
  onPress: null,
  uri: null,
};

export default ThumbnailLink;
