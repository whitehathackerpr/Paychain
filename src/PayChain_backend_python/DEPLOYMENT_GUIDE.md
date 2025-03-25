# Deployment Guide

This guide provides instructions for deploying the PayChain FastAPI backend in various environments.

## Deployment Options

The PayChain backend can be deployed in several ways depending on your needs:

1. **Docker Deployment**: Recommended for production and consistent environments
2. **Traditional Server Deployment**: Direct installation on a server
3. **Cloud Platform Deployment**: Using AWS, GCP, Azure, or other cloud providers
4. **Local Development Deployment**: For testing and development

## Prerequisites

Regardless of deployment method, ensure you have:

- Access to the PayChain backend code repository
- Database credentials and connection strings
- Required environment variables
- Domain name (for production)
- SSL certificates (for production)

## Docker Deployment

### Prerequisites

- Docker installed on the host machine
- Docker Compose (optional, for multi-container deployments)
- Access to a PostgreSQL database (can be containerized or external)

### Steps

1. **Clone the repository**:

```bash
git clone https://github.com/your-org/paychain.git
cd paychain
```

2. **Build the Docker image**:

```bash
docker build -t paychain-backend:latest .
```

3. **Create a `.env` file for environment variables**:

```
DATABASE_URL=postgresql://username:password@db:5432/paychain
SECRET_KEY=your_production_secret_key
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALGORITHM=HS256
ENVIRONMENT=production
DEBUG=false
```

4. **Run the container**:

```bash
docker run -d --name paychain-api -p 8000:8000 \
  --env-file .env \
  paychain-backend:latest
```

### Using Docker Compose

For a complete setup with database and optional services, create a `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  api:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    depends_on:
      - db
    env_file:
      - .env
    restart: always

  db:
    image: postgres:14
    volumes:
      - postgres_data:/var/lib/postgresql/data/
    environment:
      - POSTGRES_USER=paychain
      - POSTGRES_PASSWORD=secure_password
      - POSTGRES_DB=paychain
    restart: always
    
  # Optional: pgAdmin for database management
  pgadmin:
    image: dpage/pgadmin4
    depends_on:
      - db
    ports:
      - "8080:80"
    environment:
      - PGADMIN_DEFAULT_EMAIL=admin@paychain.com
      - PGADMIN_DEFAULT_PASSWORD=admin_password
    restart: always

volumes:
  postgres_data:
```

Run with:

```bash
docker-compose up -d
```

### Updating the Application

To update the application:

```bash
git pull
docker-compose build
docker-compose up -d
```

## Traditional Server Deployment

### Prerequisites

- A Linux server (Ubuntu 20.04+ recommended)
- Python 3.9+ installed
- PostgreSQL database
- Nginx or Apache for reverse proxy
- Systemd for service management

### Steps

1. **Prepare the server**:

```bash
sudo apt update
sudo apt install -y python3 python3-pip python3-venv nginx
```

2. **Clone the repository**:

```bash
git clone https://github.com/your-org/paychain.git
cd paychain/src/PayChain_backend_python
```

3. **Create a virtual environment**:

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

4. **Create a `.env` file**:

```
DATABASE_URL=postgresql://username:password@localhost:5432/paychain
SECRET_KEY=your_production_secret_key
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALGORITHM=HS256
ENVIRONMENT=production
DEBUG=false
```

5. **Initialize the database**:

```bash
python initialize_db.py
```

6. **Create a systemd service file** at `/etc/systemd/system/paychain.service`:

```ini
[Unit]
Description=PayChain API Service
After=network.target

[Service]
User=ubuntu
Group=ubuntu
WorkingDirectory=/path/to/paychain/src/PayChain_backend_python
Environment="PATH=/path/to/paychain/src/PayChain_backend_python/venv/bin"
EnvironmentFile=/path/to/paychain/src/PayChain_backend_python/.env
ExecStart=/path/to/paychain/src/PayChain_backend_python/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000

[Install]
WantedBy=multi-user.target
```

7. **Start and enable the service**:

```bash
sudo systemctl start paychain
sudo systemctl enable paychain
```

8. **Configure Nginx as a reverse proxy** by creating `/etc/nginx/sites-available/paychain`:

```nginx
server {
    listen 80;
    server_name api.paychain.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

9. **Enable the site and restart Nginx**:

```bash
sudo ln -s /etc/nginx/sites-available/paychain /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

10. **Set up SSL with Certbot**:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d api.paychain.com
```

### Updating the Application

To update the application:

```bash
cd /path/to/paychain
git pull
cd src/PayChain_backend_python
source venv/bin/activate
pip install -r requirements.txt
sudo systemctl restart paychain
```

## Cloud Platform Deployment

### AWS Elastic Beanstalk

1. **Install EB CLI**:

```bash
pip install awsebcli
```

2. **Initialize EB application**:

```bash
cd paychain/src/PayChain_backend_python
eb init
```

3. **Create a `.ebextensions/01_environment.config` file**:

```yaml
option_settings:
  aws:elasticbeanstalk:application:environment:
    DATABASE_URL: postgresql://username:password@your-rds-instance.amazonaws.com:5432/paychain
    SECRET_KEY: your_production_secret_key
    ACCESS_TOKEN_EXPIRE_MINUTES: 30
    ALGORITHM: HS256
    ENVIRONMENT: production
    DEBUG: false
```

4. **Create a `Procfile`**:

```
web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

5. **Deploy the application**:

```bash
eb create paychain-production
```

### Google Cloud Run

1. **Install gcloud CLI**:

Follow [Google Cloud SDK installation instructions](https://cloud.google.com/sdk/docs/install)

2. **Authenticate with Google Cloud**:

```bash
gcloud auth login
gcloud config set project your-project-id
```

3. **Build a Docker image and push it to Container Registry**:

```bash
gcloud builds submit --tag gcr.io/your-project-id/paychain
```

4. **Deploy to Cloud Run**:

```bash
gcloud run deploy paychain \
  --image gcr.io/your-project-id/paychain \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars="DATABASE_URL=postgresql://username:password@host:5432/paychain,SECRET_KEY=your_production_secret_key,ACCESS_TOKEN_EXPIRE_MINUTES=30,ALGORITHM=HS256,ENVIRONMENT=production,DEBUG=false"
```

### Azure App Service

1. **Install Azure CLI**:

Follow [Azure CLI installation instructions](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)

2. **Login to Azure**:

```bash
az login
```

3. **Create a resource group**:

```bash
az group create --name paychain-resources --location westus
```

4. **Create an App Service plan**:

```bash
az appservice plan create --name paychain-plan --resource-group paychain-resources --sku B1 --is-linux
```

5. **Create a web app**:

```bash
az webapp create --resource-group paychain-resources --plan paychain-plan --name paychain-api --runtime "PYTHON:3.9"
```

6. **Set environment variables**:

```bash
az webapp config appsettings set --resource-group paychain-resources --name paychain-api --settings \
  DATABASE_URL="postgresql://username:password@host:5432/paychain" \
  SECRET_KEY="your_production_secret_key" \
  ACCESS_TOKEN_EXPIRE_MINUTES=30 \
  ALGORITHM="HS256" \
  ENVIRONMENT="production" \
  DEBUG="false"
```

7. **Deploy using Git**:

```bash
az webapp deployment source config-local-git --name paychain-api --resource-group paychain-resources
git remote add azure <git-url-from-previous-command>
git push azure main
```

## Database Setup

### PostgreSQL Setup

1. **Install PostgreSQL**:

```bash
sudo apt update
sudo apt install -y postgresql postgresql-contrib
```

2. **Create a database and user**:

```bash
sudo -u postgres psql
```

```sql
CREATE DATABASE paychain;
CREATE USER paychain_user WITH ENCRYPTED PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE paychain TO paychain_user;
\q
```

3. **Update your `.env` file with the database connection string**:

```
DATABASE_URL=postgresql://paychain_user:secure_password@localhost:5432/paychain
```

### Database Migrations

Ensure database migrations are run as part of your deployment:

```bash
# Run migrations
alembic upgrade head
```

## Security Considerations

1. **Environment Variables**:
   - Keep sensitive data in environment variables, not in code
   - Use different secrets for different environments

2. **HTTPS**:
   - Always use HTTPS in production
   - Set up automatic redirects from HTTP to HTTPS

3. **API Keys and Secrets**:
   - Rotate secrets regularly
   - Use least privilege for database users

4. **Rate Limiting**:
   - Implement rate limiting to prevent abuse
   - Consider using a service like Cloudflare for additional protection

5. **Monitoring**:
   - Set up monitoring and alerting
   - Regularly review logs for suspicious activity

## Scaling Considerations

### Horizontal Scaling

1. **Database Connection Pooling**:
   - Implement connection pooling to handle more requests

2. **Stateless Application**:
   - Ensure the API is stateless for easy scaling
   - Use external session storage if needed

3. **Load Balancing**:
   - Set up a load balancer in front of multiple instances
   - Configure health checks to remove unhealthy instances

### Vertical Scaling

1. **Optimize Database Queries**:
   - Add indexes for frequently queried fields
   - Use database query optimization techniques

2. **Caching**:
   - Implement Redis for caching frequently accessed data
   - Consider response caching for read-heavy endpoints

## Monitoring and Logging

### Setting Up Monitoring

1. **Install Prometheus and Grafana**:
   - Monitor server metrics
   - Track API performance

2. **Application Metrics**:
   - Track request rates
   - Monitor response times
   - Count errors by type

### Logging Configuration

Add a `logging.conf` file:

```ini
[loggers]
keys=root,app

[handlers]
keys=consoleHandler,fileHandler

[formatters]
keys=simpleFormatter,jsonFormatter

[logger_root]
level=INFO
handlers=consoleHandler

[logger_app]
level=INFO
handlers=fileHandler
qualname=app
propagate=0

[handler_consoleHandler]
class=StreamHandler
level=INFO
formatter=simpleFormatter
args=(sys.stdout,)

[handler_fileHandler]
class=handlers.RotatingFileHandler
level=INFO
formatter=jsonFormatter
args=('logs/app.log', 'a', 10*1024*1024, 5)

[formatter_simpleFormatter]
format=%(asctime)s - %(name)s - %(levelname)s - %(message)s

[formatter_jsonFormatter]
format={"time": "%(asctime)s", "name": "%(name)s", "level": "%(levelname)s", "message": "%(message)s"}
```

### Using Sentry for Error Tracking

1. **Install Sentry SDK**:

```bash
pip install sentry-sdk
```

2. **Configure Sentry in `app/main.py`**:

```python
import sentry_sdk
from sentry_sdk.integrations.asgi import SentryAsgiMiddleware

sentry_sdk.init(
    dsn="your-sentry-dsn",
    environment=os.getenv("ENVIRONMENT", "production"),
    traces_sample_rate=0.2
)

app = FastAPI()
app.add_middleware(SentryAsgiMiddleware)
```

## Backup and Recovery

### Database Backups

1. **Scheduled backups**:

```bash
# Create a backup script
cat > backup.sh << 'EOF'
#!/bin/bash
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/path/to/backups"
pg_dump -h localhost -U paychain_user -d paychain > "$BACKUP_DIR/paychain_$TIMESTAMP.sql"
# Optionally compress
gzip "$BACKUP_DIR/paychain_$TIMESTAMP.sql"
# Optionally upload to cloud storage
# aws s3 cp "$BACKUP_DIR/paychain_$TIMESTAMP.sql.gz" s3://your-bucket/backups/
EOF

chmod +x backup.sh

# Add to crontab
echo "0 2 * * * /path/to/backup.sh" | crontab -
```

2. **Backup verification**:
   - Regularly test restoring from backups
   - Verify backup integrity

### Recovery Procedure

1. **Restore from backup**:

```bash
gunzip -c /path/to/backups/paychain_20250401_020000.sql.gz | psql -h localhost -U paychain_user -d paychain
```

2. **Document recovery steps**:
   - Keep step-by-step recovery documentation
   - Include contact information for key personnel

## Continuous Integration/Continuous Deployment (CI/CD)

### GitHub Actions Example

Create a `.github/workflows/deploy.yml` file:

```yaml
name: Deploy PayChain API

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up Python
        uses: actions/setup-python@v2
        with:
          python-version: '3.9'
      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          if [ -f requirements-dev.txt ]; then pip install -r requirements-dev.txt; else pip install -r requirements.txt; fi
      - name: Run tests
        run: |
          pytest

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to production
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /path/to/paychain
            git pull
            cd src/PayChain_backend_python
            source venv/bin/activate
            pip install -r requirements.txt
            alembic upgrade head
            sudo systemctl restart paychain
```

## Troubleshooting

### Common Issues

1. **Application won't start**:
   - Check log files for errors
   - Verify environment variables
   - Ensure database connection is working

2. **Database connection issues**:
   - Verify database credentials
   - Check network connectivity
   - Ensure database server is running

3. **Performance problems**:
   - Check database query performance
   - Monitor server resources
   - Look for memory leaks

4. **API returns 500 errors**:
   - Review application logs
   - Check for recent code changes
   - Verify dependencies are installed

### Debugging in Production

1. **Temporarily enable DEBUG mode**:
   - Set `DEBUG=true` in environment
   - Remember to disable after debugging

2. **Check logs**:
   - Review application logs
   - Check server logs (nginx, systemd)
   - Look for patterns in errors

## Conclusion

This deployment guide covers the basic steps for deploying the PayChain FastAPI backend in various environments. Adjust the instructions as needed for your specific infrastructure and requirements.

For additional support, refer to the following resources:

- FastAPI documentation: https://fastapi.tiangolo.com/
- SQLAlchemy documentation: https://docs.sqlalchemy.org/
- Docker documentation: https://docs.docker.com/
- Your cloud provider's documentation 