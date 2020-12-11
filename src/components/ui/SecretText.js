import React, { useState } from 'react';
import Text from 'antd/lib/typography/Text';

const SecretText = ({ text }) => {
  const [show, setShow] = useState(false);

  const handleToggle = e => {
    e.preventDefault();
    setShow(!show);
  };

  if (show) {
    return <Text onMouseOut={handleToggle}>{text}</Text>;
  } else {
    return <Text onClick={handleToggle}>{'*'.repeat(text.length)}</Text>;
  }
};

export default SecretText;
