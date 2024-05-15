import React, {useEffect, useState} from 'react';
import {useNetInfoInstance} from '@react-native-community/netinfo';
import {Button, ScrollView, Text, TextInput} from 'react-native';
import UdpSocketLib from 'react-native-udp';
import UdpSocket from 'react-native-udp/lib/types/UdpSocket';
import {NetworkInfo} from 'react-native-network-info';
import CustomButton from './src/components/CustomButtom';

function App(): React.JSX.Element {
  const {netInfo} = useNetInfoInstance();
  console.log(netInfo.details);
  const [receivedMessages, setReceivedMessages] = useState<string[]>([]);
  const [socket, setSocket] = useState<undefined | UdpSocket>();
  const [ipOfServer, setIpOfServer] = useState('');
  const [currentIPAddress, setCurrentIPAddress] = useState('');
  const [customMessage, setCustomMessage] = useState('Hello from other side!');

  useEffect(() => {
    NetworkInfo.getIPV4Address().then(value => {
      console.log(value);
      if (value) {
        setCurrentIPAddress(value);
      }
    });
    const server = UdpSocketLib.createSocket({type: 'udp4', debug: true});

    server.on('message', (data, rinfo) => {
      const receivedMessage = data.toString() as string;
      console.log('Received message', receivedMessage);
      setReceivedMessages([...receivedMessages, receivedMessage]);
    });

    server.on('connection', arg => {
      console.log(arg);
      console.log('SOmeone connected');
    });
    server.bind(8888);

    setSocket(server);

    return () => {
      socket && socket.close();
    };
  }, []);

  const sendMessage = () => {
    const client = socket;

    client?.send(
      customMessage,
      undefined,
      undefined,
      8888,
      ipOfServer,
      error => {
        if (error) {
          console.log('Error:', error);
        } else {
          console.log('Message is sent');
        }
      },
    );
  };

  return (
    <ScrollView
      style={{flex: 1}}
      contentContainerStyle={{flex: 1, justifyContent: 'center'}}>
      <TextInput
        placeholder="Enter IP to send message"
        style={{borderWidth: 1, borderColor: 'black'}}
        onChangeText={setIpOfServer}
        value={ipOfServer}
      />
      <CustomButton title="Send message" onPress={sendMessage} />
      <TextInput
        placeholder="Enter your message"
        value={customMessage}
        onChangeText={setCustomMessage}
      />
      <Text>This device IP: {currentIPAddress}</Text>
      <Text>Received messages:</Text>
      {receivedMessages.map(message => (
        <Text>{message}</Text>
      ))}
    </ScrollView>
  );
}

export default App;
