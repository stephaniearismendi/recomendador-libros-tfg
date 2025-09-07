import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Platform, 
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { login as apiLogin } from '../api/api';
import { AuthContext } from '../context/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';
import { loginStyles } from '../styles/components';
import {
  validateLoginForm,
  handleLoginError,
} from '../utils/loginUtils';

export default function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    const validation = validateLoginForm(email, password);
    if (!validation.isValid) {
      setErrorMessage(validation.error);
      return;
    }
    
    setLoading(true);
    setErrorMessage('');
    
    try {
      const response = await apiLogin({ email, password });
      await login(response.data.token);
    } catch (err) {
      setErrorMessage(handleLoginError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={loginStyles.container}>
      <View style={loginStyles.backgroundGradient} />
      <View style={loginStyles.floatingElement1} />
      <View style={loginStyles.floatingElement2} />
      <View style={loginStyles.floatingElement3} />
      
      <SafeAreaView style={loginStyles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={loginStyles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={loginStyles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={loginStyles.header}>
              <View style={loginStyles.logoContainer}>
                <View style={loginStyles.logoBackground}>
                  <MaterialIcons name="auto-stories" size={40} color="#5A4FFF" />
                </View>
                <Text style={loginStyles.logoText}>Read-It</Text>
                <View style={loginStyles.logoAccent} />
              </View>
              
              <Text style={loginStyles.title}>Bienvenido de nuevo</Text>
              <Text style={loginStyles.subtitle}>
                Inicia sesión para continuar tu aventura literaria
              </Text>
            </View>

            <View style={loginStyles.glassContainer}>
              <View style={loginStyles.formContainer}>
                <View style={loginStyles.inputGroup}>
                  <Text style={loginStyles.inputLabel}>Email</Text>
                  <View style={loginStyles.inputContainer}>
                    <View style={loginStyles.inputIconContainer}>
                      <MaterialIcons name="email" size={18} color="#5A4FFF" />
                    </View>
                    <TextInput
                      style={loginStyles.input}
                      placeholder="tu@email.com"
                      placeholderTextColor="rgba(107, 114, 128, 0.6)"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      value={email}
                      onChangeText={setEmail}
                    />
                  </View>
                </View>

                <View style={loginStyles.inputGroup}>
                  <Text style={loginStyles.inputLabel}>Contraseña</Text>
                  <View style={loginStyles.inputContainer}>
                    <View style={loginStyles.inputIconContainer}>
                      <MaterialIcons name="lock" size={18} color="#5A4FFF" />
                    </View>
                    <TextInput
                      style={loginStyles.input}
                      placeholder="Tu contraseña"
                      placeholderTextColor="rgba(107, 114, 128, 0.6)"
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                      value={password}
                      onChangeText={setPassword}
                    />
                    <TouchableOpacity
                      style={loginStyles.eyeButton}
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <MaterialIcons
                        name={showPassword ? 'visibility' : 'visibility-off'}
                        size={18}
                        color="#5A4FFF"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {errorMessage !== '' && (
                  <View style={loginStyles.errorContainer}>
                    <MaterialIcons name="error-outline" size={16} color="#E63946" />
                    <Text style={loginStyles.errorText}>{errorMessage}</Text>
                  </View>
                )}

                <TouchableOpacity
                  style={[loginStyles.loginButton, loading && loginStyles.buttonDisabled]}
                  onPress={handleLogin}
                  disabled={loading}
                >
                  <View style={loginStyles.buttonGradient}>
                    {loading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <>
                        <Text style={loginStyles.loginButtonText}>Iniciar sesión</Text>
                        <MaterialIcons name="arrow-forward" size={18} color="#fff" />
                      </>
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={loginStyles.footer}>
              <Text style={loginStyles.footerText}>
                ¿No tienes una cuenta?{' '}
                <Text
                  style={loginStyles.linkText}
                  onPress={() => navigation.navigate('Register')}
                >
                  Regístrate aquí
                </Text>
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}