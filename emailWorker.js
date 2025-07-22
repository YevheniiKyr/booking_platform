const {emailQueue} = require('./bullConfig');

emailQueue.process(async (job) => {
    console.log('Processing job:', job.data);
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Done processing job:', job.data);
});
