import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  Pressable,
} from 'react-native';
import React, {useState} from 'react';
import {object, number} from 'yup';
import {Formik} from 'formik';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

export default function App() {
  const passwordlengthSchema = object({
    passwordlength: number()
      .min(4, 'minimum possible number is 4')
      .max(16, 'maximum possible number is 16')
      .required('password length is required to generate password'),
  });

  const [password, setPassword] = useState('');
  const [isGenerated, setGenerated] = useState(false);
  const [lowercase, setLowercase] = useState(true);
  const [uppercase, setUppercase] = useState(false);
  const [numbers, setNumbers] = useState(false);
  const [symbols, setSymbols] = useState(false);

  const generatePasswordString = (passwordlength: number) => {
    //function to geenrate passwordstring
    let charList = '';

    const uppercasechars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercasechars = uppercasechars.toLowerCase();
    const digitchars = '0123456789';
    const specialchars = '!@#$%^&*()_+';

    if (lowercase) {
      charList += lowercasechars;
    }
    if (uppercase) {
      charList += uppercasechars;
    }
    if (numbers) {
      charList += digitchars;
    }
    if (symbols) {
      charList += specialchars;
    }
    setGenerated(true);
    setPassword(createPassword(charList, passwordlength));
  };

  const createPassword = (characters: string, passwordLength: number) => {
    //function for creating password from characters and passwordlength
    //the idea is to generate a random character index and according to the index we will create the resulting password
    let result = '';
    for (let i = 0; i < passwordLength; i++) {
      const charIndex = Math.round(Math.random() * characters.length);
      result += characters[charIndex];
    }
    // console.log('create password', result);
    return result;
  };

  const resetPasswordState = () => {
    //for resetting the states
    // console.log('calling reset passworkd');
    setPassword('');
    setGenerated(false);
    setLowercase(true);
    setNumbers(false);
    setUppercase(false);
    setSymbols(false);
  };

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <SafeAreaView style={styles.appContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Password Generator</Text>
          <Formik
            initialValues={{passwordlength: ''}}
            validationSchema={passwordlengthSchema}
            onSubmit={values => generatePasswordString(+values.passwordlength)}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              isValid,
              touched,
              handleReset,
            }) => (
              <>
                <View style={styles.inputWrapper}>
                  <View style={styles.inputColumn}>
                    <Text style={styles.heading}>Password Length:</Text>
                    {touched.passwordlength && errors.passwordlength && (
                      <Text style={styles.errorText}>
                        {errors.passwordlength}
                      </Text>
                    )}
                  </View>
                  <TextInput
                    style={styles.inputStyle}
                    onChangeText={handleChange('passwordlength')}
                    onBlur={handleBlur('passwordlength')}
                    value={values.passwordlength}
                    placeholder="enter a password length"
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Text>Include Lowercase</Text>
                  <BouncyCheckbox
                    disableBuiltInState
                    size={25}
                    fillColor="red"
                    isChecked={lowercase}
                    unfillColor="#FFFFFF"
                    onPress={() => {
                      setLowercase(prev => !prev);
                    }}
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Text>Include Uppercase</Text>
                  <BouncyCheckbox
                    disableBuiltInState
                    size={25}
                    fillColor="red"
                    isChecked={uppercase}
                    unfillColor="#FFFFFF"
                    onPress={() => {
                      setUppercase(prev => !prev);
                    }}
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Text>Include Special chara</Text>
                  <BouncyCheckbox
                    disableBuiltInState
                    size={25}
                    fillColor="red"
                    unfillColor="#FFFFFF"
                    isChecked={symbols}
                    onPress={() => {
                      setSymbols(prev => !prev);
                    }}
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Text>Include numbers</Text>
                  <BouncyCheckbox
                    disableBuiltInState
                    size={25}
                    fillColor="red"
                    unfillColor="#FFFFFF"
                    isChecked={numbers}
                    onPress={() => {
                      setNumbers(prev => !prev);
                    }}
                  />
                </View>

                <View style={styles.formActions}>
                  <Pressable
                    style={styles.secondaryBtn}
                    onPress={() => {
                      handleReset();
                      resetPasswordState();
                    }}>
                    <Text style={styles.secondaryBtnTxt}>Reset</Text>
                  </Pressable>
                  <Pressable
                    disabled={!isValid}
                    style={styles.primaryBtn}
                    onPress={handleSubmit}>
                    <Text style={styles.primaryBtnTxt}>Generate Password</Text>
                  </Pressable>
                </View>
              </>
            )}
          </Formik>
        </View>
        {isGenerated ? (
          <View style={[styles.card, styles.cardElevated]}>
            <Text style={styles.subTitle}>Result:</Text>
            <Text style={styles.subTitle}>Long Press to copy..</Text>
            <Text selectable={true} style={styles.generatedPassword}>
              {password}
            </Text>
          </View>
        ) : null}
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
  },
  formContainer: {
    margin: 8,
    padding: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    marginBottom: 15,
  },
  subTitle: {
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 2,
  },
  description: {
    color: '#758283',
    marginBottom: 8,
  },
  heading: {
    fontSize: 15,
  },
  inputWrapper: {
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  inputColumn: {
    flexDirection: 'column',
  },
  inputStyle: {
    padding: 8,
    width: '30%',
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#16213e',
  },
  errorText: {
    fontSize: 12,
    color: '#ff0d10',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  primaryBtn: {
    width: 120,
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 8,
    backgroundColor: '#5DA3FA',
  },
  primaryBtnTxt: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
  },
  secondaryBtn: {
    width: 120,
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 8,
    backgroundColor: '#CAD5E2',
  },
  secondaryBtnTxt: {
    textAlign: 'center',
  },
  card: {
    padding: 12,
    borderRadius: 6,
    marginHorizontal: 12,
  },
  cardElevated: {
    backgroundColor: '#ffffff',
    elevation: 1,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowColor: '#333',
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  generatedPassword: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 12,
    color: '#000',
  },
});
