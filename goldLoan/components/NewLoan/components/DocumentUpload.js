import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export const DocumentUpload = React.memo(({ documents, onUpload, onPreview }) => {
  return (
    <View>
      {documents.map((doc, i) => (
        <View key={i}>
          <Text>{doc.name}</Text>
          <TouchableOpacity onPress={() => onPreview(doc)}>
            <Text>Preview</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity onPress={onUpload}>
        <Text>+ Upload Document</Text>
      </TouchableOpacity>
    </View>
  );
});
