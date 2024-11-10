import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
  },
  shield: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  name: {
    flex: 1,
    fontSize: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    padding: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
  },
  deleteButton: {
    padding: 8,
    backgroundColor: '#ffecec',
    borderRadius: 4,
  },
});
