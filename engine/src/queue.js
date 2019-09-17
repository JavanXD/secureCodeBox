const redis = require('./redis');
const uuid = require('uuid/v4');

async function lookForJob(jobType, tenant) {
  const scanId = await redis.lpop(`${tenant}:${jobType}`);

  if (scanId) {
    const scanJob = await redis.get(`job:${scanId}`);
    return JSON.parse(scanJob);
  }

  return null;
}
module.exports.lookForJob = lookForJob;

async function createScanJob(jobType, tenant, parameters) {
  const id = uuid();
  await redis.lpush(`${tenant}:${jobType}`, id);
  await redis.set(
    `job:${id}`,
    JSON.stringify({ id, parameters, createdAt: new Date() })
  );

  return id;
}
module.exports.createScanJob = createScanJob;
