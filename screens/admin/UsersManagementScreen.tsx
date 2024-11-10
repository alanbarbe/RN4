import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Alert, Image, ScrollView } from 'react-native';
import { User, Player, Team } from '../../types';
import { useUserManagement } from '../../hooks/useUserManagment';
import * as ImagePicker from 'expo-image-picker';
import { uploadImage } from '../../utils/storage';
import { useAuth } from '../../context/authContext';

interface CreateUserForm {
    email: string;
    role: 'player' | 'team';
    // Campos específicos para jugadores
    name?: string;
    surname?: string;
    jerseyNumber?: string;
    age?: string;
    position?: string;
    // Campos específicos para equipos
    teamName?: string;
    teamShield?: string;
}

const UsersManagementScreen = () => {
    const [users, setUsers] = useState<User[]>([]);
    const { createUserWithRole } = useUserManagement();
    const [showForm, setShowForm] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'player' as 'player' | 'team',
        name: '',
        surname: '',
        jerseyNumber: '',
        age: '',
        position: '',
        teamName: '',
        teamShield: '',
    });


    const { signOut } = useAuth();

    const handleLogout = () => {
        Alert.alert(
            "Confirmar cierre de sesión",
            "¿Estás seguro que deseas cerrar sesión?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Cerrar sesión",
                    style: "destructive",
                    onPress: () => signOut()
                }
            ]
        );
    };

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert('Permission Required', 'You need to grant permission to access your photos');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
            setFormData(prev => ({ ...prev, teamShield: result.assets[0].uri }));
        }
    };


    const handleCreateUser = async () => {
        try {
            if (formData.role === 'team' && selectedImage) {
                console.log('Starting team creation with image upload...');
                console.log('Selected image URI:', selectedImage);

                let publicUrl: string | null = null;

                try {
                    publicUrl = await uploadImage(selectedImage, 'team-shields');
                    console.log('Upload successful, received URL:', publicUrl);

                    if (!publicUrl) {
                        throw new Error('No se pudo obtener la URL de la imagen');
                    }

                    // Crear el usuario con la imagen
                    const result = await createUserWithRole({
                        email: formData.email,
                        password: formData.password,
                        role: 'team',
                        teamData: {
                            name: formData.teamName,
                            team_shield: publicUrl,
                        },
                    });

                    console.log('Team creation successful:', result);
                    setShowForm(false);
                    setSelectedImage(null);
                    Alert.alert('Éxito', 'Usuario y equipo creados correctamente');

                } catch (uploadError) {
                    console.error('Error during upload or team creation:', uploadError);
                    Alert.alert(
                        'Error',
                        'No se pudo subir la imagen o crear el equipo. Por favor, intenta nuevamente.'
                    );
                    return;
                }


            } else if (formData.role === 'player') {
                // Lógica existente para crear jugador
                const result = await createUserWithRole({
                    email: formData.email,
                    password: formData.password,
                    role: 'player',
                    playerData: {
                        name: formData.name,
                        surname: formData.surname,
                        jersey_number: parseInt(formData.jerseyNumber) || 0,
                        age: parseInt(formData.age) || 0,
                        position: formData.position,
                    },
                });
                console.log('Player creation result:', result);
            }

            setShowForm(false);
            setSelectedImage(null);
            Alert.alert('Éxito', 'Usuario creado correctamente');
        } catch (error) {
            console.error('Error in handleCreateUser:', error);
            Alert.alert(
                'Error',
                error instanceof Error
                    ? error.message
                    : 'Ocurrió un error al crear el usuario'
            );
        }
    };

    const renderTeamImageUpload = () => (
        <View style={styles.imageUploadContainer}>
            {selectedImage ? (
                <View style={styles.selectedImageContainer}>
                    <Image
                        source={{ uri: selectedImage }}
                        style={styles.selectedImage}
                    />
                    <TouchableOpacity
                        style={styles.changeImageButton}
                        onPress={pickImage}
                    >
                        <Text style={styles.changeImageText}>Cambiar imagen</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <TouchableOpacity
                    style={styles.uploadButton}
                    onPress={pickImage}
                >
                    <Text style={styles.uploadButtonText}>Subir escudo del equipo</Text>
                </TouchableOpacity>
            )}
        </View>
    );


    const renderForm = () => (
        <ScrollView>
        
        <View style={styles.formContainer}>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={formData.email}
                onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
            />

            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                value={formData.password}
                onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
                secureTextEntry
            />

            <TouchableOpacity
                style={[
                    styles.roleSelector,
                    formData.role === 'player' && styles.roleSelectorActive
                ]}
                onPress={() => setFormData(prev => ({ ...prev, role: 'player' }))}
            >
                <Text>Jugador</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[
                    styles.roleSelector,
                    formData.role === 'team' && styles.roleSelectorActive
                ]}
                onPress={() => setFormData(prev => ({ ...prev, role: 'team' }))}
            >
                <Text>Equipo</Text>
            </TouchableOpacity>

            {formData.role === 'player' && (
                <>
                    <TextInput
                        style={styles.input}
                        placeholder="Nombre"
                        value={formData.name}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Apellido"
                        value={formData.surname}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, surname: text }))}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Número de camiseta"
                        value={formData.jerseyNumber}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, jerseyNumber: text }))}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Edad"
                        value={formData.age}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, age: text }))}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Posición"
                        value={formData.position}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, position: text }))}
                    />
                </>
            )}

            {formData.role === 'team' && (
                <>
                    <TextInput
                        style={styles.input}
                        placeholder="Nombre del equipo"
                        value={formData.teamName}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, teamName: text }))}
                    />
                    {renderTeamImageUpload()}
                </>
            )}

            <TouchableOpacity
                style={[
                    styles.submitButton,
                    (!formData.email || !formData.password ||
                        (formData.role === 'team' && (!formData.teamName || !selectedImage))) &&
                    styles.submitButtonDisabled
                ]}
                onPress={handleCreateUser}
                disabled={!formData.email || !formData.password ||
                    (formData.role === 'team' && (!formData.teamName || !selectedImage))}
            >
                <Text style={styles.submitButtonText}>Crear Usuario</Text>
            </TouchableOpacity>
        </View>
        </ScrollView>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setShowForm(!showForm)}
                >
                    <Text style={styles.buttonText}>
                        {showForm ? 'Cancelar' : 'Agregar Usuario'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
                </TouchableOpacity>
            </View>

            {showForm ? renderForm() : (
                <FlatList
                    data={users}
                    style={styles.list}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <View style={styles.cardContent}>
                                <Text style={styles.emailText}>{item.email}</Text>
                                <Text style={styles.roleText}>{item.role}</Text>
                            </View>
                        </View>
                    )}
                    keyExtractor={item => item.user.toString()}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    addButton: {
        backgroundColor: '#34D399',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    logoutButton: {
        backgroundColor: '#ff4444',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    formContainer: {
        padding: 20,
    },
    input: {
        height: 45,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
    },
    roleSelector: {
        padding: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
        marginBottom: 10,
    },
    roleSelectorActive: {
        backgroundColor: '#34D399',
        borderColor: '#34D399',
    },
    submitButton: {
        backgroundColor: '#34D399',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    list: {
        padding: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    emailText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    roleText: {
        fontSize: 14,
        color: '#666',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
    },
    roleButton: {
        backgroundColor: '#f0f0f0',
        padding: 8,
        borderRadius: 6,
        marginRight: 10,
    },
    roleButtonText: {
        color: '#666',
    },
    deleteButton: {
        padding: 8,
    },
    deleteText: {
        color: '#ff4444',
        fontWeight: 'bold',
    },
    imageUploadContainer: {
        marginVertical: 10,
        alignItems: 'center',
    },
    uploadButton: {
        backgroundColor: '#f0f0f0',
        padding: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        borderStyle: 'dashed',
        width: '100%',
        alignItems: 'center',
    },
    uploadButtonText: {
        color: '#666',
        fontSize: 16,
    },
    selectedImageContainer: {
        alignItems: 'center',
        width: '100%',
    },
    selectedImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    changeImageButton: {
        padding: 8,
        backgroundColor: '#f0f0f0',
        borderRadius: 6,
    },
    changeImageText: {
        color: '#666',
    },
    submitButtonDisabled: {
        backgroundColor: '#a8a8a8',
        opacity: 0.7,
    },

});

export default UsersManagementScreen;