import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { registerStyles } from '../styles/components';
import {
  validateRegistrationForm,
  handleRegistrationError,
  showRegistrationSuccess,
  getInitialFormData,
  formatRegistrationData,
} from '../utils/registerUtils';

export default function RegisterScreen({ navigation }) {
  const { register } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(getInitialFormData());
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    const validation = validateRegistrationForm(formData);
    if (!validation.isValid) {
      Alert.alert('Error', validation.error);
      return;
    }

    setLoading(true);
    try {
      const registrationData = formatRegistrationData(formData);
      await register(registrationData);
      showRegistrationSuccess(navigation);
    } catch (error) {
      const errorMessage = handleRegistrationError(error);
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={registerStyles.container}>
      <View style={registerStyles.backgroundGradient} />
      <View style={registerStyles.floatingElement1} />
      <View style={registerStyles.floatingElement2} />
      <View style={registerStyles.floatingElement3} />

      <SafeAreaView style={registerStyles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={registerStyles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={registerStyles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={registerStyles.header}>
              <TouchableOpacity
                style={registerStyles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
              </TouchableOpacity>

              <View style={registerStyles.logoContainer}>
                <View style={registerStyles.logoBackground}>
                  <Ionicons name="book" size={40} color="#5A4FFF" />
                </View>
                <Text style={registerStyles.logoText}>Read-It</Text>
                <View style={registerStyles.logoAccent} />
              </View>

              <Text style={registerStyles.title}>Crear cuenta</Text>
              <Text style={registerStyles.subtitle}>Únete a nuestra comunidad de lectores</Text>
            </View>

            <View style={registerStyles.glassContainer}>
              <View style={registerStyles.formContainer}>
                <View style={registerStyles.inputGroup}>
                  <Text style={registerStyles.inputLabel}>Nombre completo</Text>
                  <View style={registerStyles.inputContainer}>
                    <View style={registerStyles.inputIconContainer}>
                      <Ionicons name="person" size={18} color="#5A4FFF" />
                    </View>
                    <TextInput
                      style={registerStyles.input}
                      value={formData.name}
                      onChangeText={(value) => handleInputChange('name', value)}
                      placeholder="Tu nombre completo"
                      placeholderTextColor="rgba(107, 114, 128, 0.6)"
                      autoCapitalize="words"
                      autoCorrect={false}
                    />
                  </View>
                </View>

                <View style={registerStyles.inputGroup}>
                  <Text style={registerStyles.inputLabel}>Nombre de usuario</Text>
                  <View style={registerStyles.inputContainer}>
                    <View style={registerStyles.inputIconContainer}>
                      <Ionicons name="at" size={18} color="#5A4FFF" />
                    </View>
                    <TextInput
                      style={registerStyles.input}
                      value={formData.username}
                      onChangeText={(value) => handleInputChange('username', value)}
                      placeholder="tu_usuario"
                      placeholderTextColor="rgba(107, 114, 128, 0.6)"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>
                </View>

                <View style={registerStyles.inputGroup}>
                  <Text style={registerStyles.inputLabel}>Email</Text>
                  <View style={registerStyles.inputContainer}>
                    <View style={registerStyles.inputIconContainer}>
                      <Ionicons name="mail" size={18} color="#5A4FFF" />
                    </View>
                    <TextInput
                      style={registerStyles.input}
                      value={formData.email}
                      onChangeText={(value) => handleInputChange('email', value)}
                      placeholder="tu@email.com"
                      placeholderTextColor="rgba(107, 114, 128, 0.6)"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>
                </View>

                <View style={registerStyles.inputGroup}>
                  <Text style={registerStyles.inputLabel}>Contraseña</Text>
                  <View style={registerStyles.inputContainer}>
                    <View style={registerStyles.inputIconContainer}>
                      <Ionicons name="lock-closed" size={18} color="#5A4FFF" />
                    </View>
                    <TextInput
                      style={registerStyles.input}
                      value={formData.password}
                      onChangeText={(value) => handleInputChange('password', value)}
                      placeholder="Mínimo 6 caracteres"
                      placeholderTextColor="rgba(107, 114, 128, 0.6)"
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    <TouchableOpacity
                      style={registerStyles.eyeButton}
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

                <View style={registerStyles.inputGroup}>
                  <Text style={registerStyles.inputLabel}>Confirmar contraseña</Text>
                  <View style={registerStyles.inputContainer}>
                    <View style={registerStyles.inputIconContainer}>
                      <Ionicons name="lock-closed" size={18} color="#5A4FFF" />
                    </View>
                    <TextInput
                      style={registerStyles.input}
                      value={formData.confirmPassword}
                      onChangeText={(value) => handleInputChange('confirmPassword', value)}
                      placeholder="Repite tu contraseña"
                      placeholderTextColor="rgba(107, 114, 128, 0.6)"
                      secureTextEntry={!showConfirmPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    <TouchableOpacity
                      style={registerStyles.eyeButton}
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <MaterialIcons
                        name={showConfirmPassword ? 'visibility' : 'visibility-off'}
                        size={18}
                        color="#5A4FFF"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity
                  style={[registerStyles.registerButton, loading && registerStyles.buttonDisabled]}
                  onPress={handleRegister}
                  disabled={loading}
                >
                  <View style={registerStyles.buttonGradient}>
                    {loading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <>
                        <Text style={registerStyles.registerButtonText}>Crear cuenta</Text>
                        <Ionicons name="arrow-forward" size={18} color="#fff" />
                      </>
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={registerStyles.footer}>
              <Text style={registerStyles.footerText}>
                ¿Ya tienes una cuenta?{' '}
                <Text style={registerStyles.linkText} onPress={() => navigation.navigate('Login')}>
                  Iniciar sesión
                </Text>
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
