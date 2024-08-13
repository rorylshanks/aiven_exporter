<a name="readme-top"></a>

<div align="center">
<h3 align="center">Aiven Metrics Prometheus Exporter</h3>

  <p align="center">
    A Node.js application that authenticates to Aiven and exposes project service metrics as Prometheus metrics.
    <br />
    <br />
    <a href="https://github.com/rorylshanks/aiven-metrics-exporter/issues">Report Bug</a>
    ·
    <a href="https://github.com/rorylshanks/aiven-metrics-exporter/issues">Request Feature</a>
  </p>
</div>

<!-- ABOUT THE PROJECT -->
## About The Project

The Aiven Metrics Prometheus Exporter is a Node.js application designed to fetch and expose key metrics from Aiven services to Prometheus. This tool authenticates to Aiven using an API token, retrieves the CPU usage, disk usage, load average, and memory usage for each service within each project, and makes this data available as Prometheus metrics via an HTTP server.

Key benefits of this exporter include:

- **Centralized Monitoring**  
  Easily integrate Aiven service metrics into your existing Prometheus-based monitoring setup, providing a unified view of all your infrastructure metrics.
  
- **Real-time Metrics**  
  The exporter collects the most recent metrics from Aiven, ensuring that you are monitoring up-to-date data.

- **Simple Deployment**  
  The exporter is easy to set up and run, requiring minimal configuration to get started with monitoring your Aiven services.

- **Support for Hobby Projects**  
  This exporter allows you to monitor metrics for hobby projects that do not have the ability to integrate directly with Prometheus, providing visibility into smaller or non-commercial projects that might otherwise lack robust monitoring.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

#### Running with Docker

A Docker image is available for easy deployment. You can use the following `docker-compose.yml` file to run the exporter:

```yaml
services:
  aiven_exporter:
    image: rorylshanks/aiven_exporter:latest
    environment:
      AIVEN_TOKEN: ${AIVEN_TOKEN}
    ports:
      - 3000:3000
```

To run the exporter using Docker Compose:

1. Create a `docker-compose.yml` file with the above content.
2. Run the application with Docker Compose:
   ```
   docker-compose up
   ```

#### Running with Docker CLI

Alternatively, you can run the Docker container directly from the command line:

```bash
docker run -d -p 3000:3000 -e AIVEN_TOKEN=your_aiven_api_token rorylshanks/aiven_exporter:latest
```

This command pulls the Docker image, sets the required environment variable (`AIVEN_TOKEN`), and exposes the application on port 3000.

### Accessing Metrics

Once the application is running, you can access the Prometheus metrics by visiting:

```
http://localhost:3000/metrics
```

Prometheus can be configured to scrape this endpoint at regular intervals to collect the Aiven service metrics.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONFIGURATION -->
## Configuration

The following environment variables are used to configure the exporter:

- `AIVEN_TOKEN`: Your Aiven API token. This is required to authenticate with the Aiven API.
- `PORT`: The port on which the HTTP server will run (default: `3000`).

Ensure that the Aiven API token has the necessary permissions to access the projects and services you wish to monitor.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this project better, please fork the repository and create a pull request. You can also simply open an issue with the tag "enhancement". Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>