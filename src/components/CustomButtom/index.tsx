import React from 'react';
import {TouchableOpacity, Text} from 'react-native';
import {preview} from 'react-native-ide';

interface Props {
  title: string;
  onPress: () => void;
}

const CustomButton = (props: Props) => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <Text>{props.title}</Text>
    </TouchableOpacity>
  );
};

preview(
  <CustomButton title="Preview" onPress={() => console.log('Pressed')} />,
);

export default CustomButton;
