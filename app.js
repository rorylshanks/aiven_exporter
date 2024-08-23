const express = require('express');
const axios = require('axios');
const client = require('prom-client');

const app = express();
const port = 3000;

// Replace with your Aiven API token
const AIVEN_TOKEN = process.env.AIVEN_TOKEN;

if (!AIVEN_TOKEN) {
    console.error("No AIVEN_TOKEN environment variable found! Please check and try again")
    process.exit(1)
}

// Prometheus metrics
const cpuUsageGauge = new client.Gauge({
  name: 'aiven_service_cpu_usage',
  help: 'CPU usage for Aiven service',
  labelNames: ['project', 'service'],
});

const diskUsageGauge = new client.Gauge({
  name: 'aiven_service_disk_usage',
  help: 'Disk usage for Aiven service',
  labelNames: ['project', 'service'],
});

const loadAverageGauge = new client.Gauge({
  name: 'aiven_service_load_average',
  help: 'Load average for Aiven service',
  labelNames: ['project', 'service'],
});

const memoryUsageGauge = new client.Gauge({
  name: 'aiven_service_memory_usage',
  help: 'Memory usage for Aiven service',
  labelNames: ['project', 'service'],
});

const getProjects = async () => {
    console.log("Getting projects")
  const response = await axios.get('https://api.aiven.io/v1/project', {
    headers: { Authorization: `aivenv1 ${AIVEN_TOKEN}` },
  });
  console.log(`Found ${response.data.projects.length} projects`)
  return response.data.projects;
};

const getServices = async (project) => {
    console.log(`Getting services for project ${project}`)
  const response = await axios.get(
    `https://api.aiven.io/v1/project/${project}/service`,
    { headers: { Authorization: `aivenv1 ${AIVEN_TOKEN}` } }
  );
  console.log(`Found ${response.data.services.length} services for project`)
  return response.data.services;
};

const getServiceMetrics = async (project, service) => {
    console.log(`Getting metrics for service ${service} in project ${project}`)
  const response = await axios.post(
    `https://api.aiven.io/v1/project/${project}/service/${service}/metrics`,
    {period: 'hour'},
    { headers: { Authorization: `aivenv1 ${AIVEN_TOKEN}` } }
  );
  return response.data.metrics;
};

const parseMostRecentMetric = (metricData) => {
    const rows = metricData.data.rows;
    if (rows.length === 0) return null;
  
    const mostRecentRow = rows[rows.length - 1];
    const metricValue = mostRecentRow[mostRecentRow.length - 1];
  
    return metricValue;
  };

const updateMetrics = async () => {
  const projects = await getProjects();
  for (const project of projects) {
    const services = await getServices(project.project_name);
    for (const service of services) {
      const metrics = await getServiceMetrics(
        project.project_name,
        service.service_name
      );
      const cpuUsage = parseMostRecentMetric(metrics.cpu_usage);
      const diskUsage = parseMostRecentMetric(metrics.disk_usage);
      const loadAverage = parseMostRecentMetric(metrics.load_average);
      const memoryUsage = parseMostRecentMetric(metrics.mem_usage);
      if (!cpuUsage || !diskUsage || !loadAverage || !memoryUsage) {
        console.log(`Service ${service} has returned invalid metrics, skipping`)
        console.log(JSON.stringify(metrics))
        continue;
      }
      cpuUsageGauge.set(
        { project: project.project_name, service: service.service_name },
        cpuUsage
      );
      diskUsageGauge.set(
        { project: project.project_name, service: service.service_name },
        diskUsage
      );
      loadAverageGauge.set(
        { project: project.project_name, service: service.service_name },
        loadAverage
      );
      memoryUsageGauge.set(
        { project: project.project_name, service: service.service_name },
        memoryUsage
      );
    }
  }
};

app.get('/metrics', async (req, res) => {
    try {
        await updateMetrics();
        res.set('Content-Type', client.register.contentType);
        var metrics = await client.register.metrics()
        res.send(metrics);
        console.log("Sent metrics!")
    } catch (error) {
        console.log(error)
        res.status(500).send(error.message)
    }

});

app.listen(port, () => {
  console.log(`Prometheus metrics server running at http://localhost:${port}/metrics`);
});
