import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as internsService from '../../services/Internship/interns';
import { GetInternsParams, UpdateInternParams } from '../../services/Internship/interns';
import { MOCK_DATA } from '../../constants/MockData';

export const useInterns = (params?: GetInternsParams) => {
    return useQuery({
        queryKey: ['interns', params],
        queryFn: () => internsService.getInterns(params),
        initialData: {
            code: 200,
            data: {
                hits: MOCK_DATA.interns,
                pagination: {
                    totalPages: 1,
                    totalRows: MOCK_DATA.interns.length
                }
            }
        }
    });
};

export const useIntern = (id: string) => {
    return useQuery({
        queryKey: ['intern', id],
        queryFn: () => internsService.getIntern(id),
        enabled: !!id
    });
};

export const useUpdateIntern = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (params: UpdateInternParams) => internsService.updateIntern(params),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['interns'] });
            queryClient.invalidateQueries({ queryKey: ['intern', data.data.id] });
        }
    });
};
