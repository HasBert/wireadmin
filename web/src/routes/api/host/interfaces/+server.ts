import 'dotenv/config';

import Network from '@lib/network';
import { json, type RequestHandler } from '@sveltejs/kit';
import { execa } from 'execa';

import logger from '$lib/logger';

export const GET: RequestHandler = async () => {
  try {
    const interfaces = await Network.interfacesInUse();
    if (!interfaces?.length) {
      return json({ error: 'No network interfaces found.' }, { status: 404 });
    }
    return json({ data: interfaces });
  } catch (error) {
    const msg = 'Error requesting interfaces.';
    logger.error(error, msg);
    return json({ error: msg }, { status: 500 });
  }
};
