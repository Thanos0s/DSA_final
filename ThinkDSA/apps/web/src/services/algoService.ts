import api from './api';

export interface AlgoStep {
    id: number;
    title: string;
    description: string;
    type: 'init' | 'loop' | 'condition' | 'process' | 'return';
}

export interface AlgoVisualization {
    title: string;
    complexity: {
        time: string;
        space: string;
    };
    steps: AlgoStep[];
}

export const fetchAlgoVisualization = async (problemId: string): Promise<AlgoVisualization> => {
    const response = await api.post('/algo/visualize', { problemId });
    return response.data;
};
