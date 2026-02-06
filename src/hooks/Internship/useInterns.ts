import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as internsService from '../../services/Internship/interns';
import { GetInternsParams, UpdateInternParams } from '../../services/Internship/interns';

export const useInterns = (params?: GetInternsParams) => {
    return useQuery({
        queryKey: ['interns', params],
        queryFn: () => internsService.getInterns(params)
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
