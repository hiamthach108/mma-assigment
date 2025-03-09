import { ArtTool } from '@/types/artTool';
import api from '.';

const getArtToolList = async () => {
  const response = await api.get('');

  return response as unknown as ArtTool[];
};

const getArtToolById = async (id: string) => {
  const response = await api.get(`/${id}`);

  return response as unknown as ArtTool;
};

const artToolApi = {
  getArtToolList,
  getArtToolById,
};

export default artToolApi;
