
echo "Logging in to AWS ECR..."
aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin 447239692229.dkr.ecr.us-east-2.amazonaws.com

echo "Building Docker image..."
docker build -t 447239692229.dkr.ecr.us-east-2.amazonaws.com/aneighbour-react-docker:latest 

echo "Pushing image to AWS ECR..."
docker push 447239692229.dkr.ecr.us-east-2.amazonaws.com/aneighbour-react-docker:latest 

echo "Deployment to AWS ECR completed successfully!"






