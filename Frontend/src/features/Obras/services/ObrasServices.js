import { request } from "../../../services/api.js";

const ObraService = {
    getAll: () => request('/obras'),

    getPatronal: () => request('/patronales'),

    create: (obra) =>
        request('/obras', { method: 'POST', body: JSON.stringify(obra) }),

    update: (id, obra) =>
        request(`/obras/${id}`, { method: 'PUT', body: JSON.stringify(obra) }),

    delete: (id) => request(`/obras/${id}`, { method: 'DELETE' }),
};

export default ObraService;