import React from 'react';
import MaskedInput from 'react-text-mask';
import { TextField, TextFieldProps } from '@mui/material';

const NumberMask = React.forwardRef<MaskedInput>(function NumberMask(props, inputRef: any) {
  return (
    <MaskedInput
      {...props}
      ref={(ref: any) => inputRef(ref ? ref.inputElement : null)}
      guide={false}
      mask={(input = '') => Array(input.length).fill(/\d/)}
    />
  );
});

function NumberInput(props: TextFieldProps & { id: string; name: string; maxLength: number }) {
  const { maxLength } = props;
  return (
    <TextField
      type="text"
      {...props}
      InputProps={{
        inputComponent: NumberMask as any,
        inputProps: {
          maxLength,
        },
      }}
    />
  );
}

export default NumberInput;
