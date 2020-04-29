import {restClient} from "../config/utils";

const client = restClient('api/v1/admin');

export async function getModerators() {
    const response = await client.get(`/moderators`);
    return response.data;
}
