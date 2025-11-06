#!/bin/bash

# Finance Search Application Startup Script
# Starts both the React frontend and Finance GPT API backend

echo "🚀 Starting Finance Search Application..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if a port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

# Check if ports are available
echo -e "${BLUE}Checking port availability...${NC}"

if check_port 3000; then
    echo -e "${YELLOW}Warning: Port 3000 is already in use. React app might not start.${NC}"
fi

if check_port 5001; then
    echo -e "${YELLOW}Warning: Port 5001 is already in use. Finance API might not start.${NC}"
fi

# Install backend dependencies if needed
echo -e "${BLUE}Setting up Finance API backend...${NC}"
cd src/server

if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing backend dependencies...${NC}"
    npm install
fi

# Start the Finance API in background
echo -e "${GREEN}Starting Finance GPT API on port 5001...${NC}"
npm start &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Go back to root and start React frontend
echo -e "${BLUE}Setting up React frontend...${NC}"
cd ../..

# Start React app
echo -e "${GREEN}Starting React frontend on port 3000...${NC}"
npm start &
FRONTEND_PID=$!

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}Shutting down applications...${NC}"
    
    # Kill backend process
    if kill -0 $BACKEND_PID 2>/dev/null; then
        echo -e "${BLUE}Stopping Finance API...${NC}"
        kill $BACKEND_PID
    fi
    
    # Kill frontend process
    if kill -0 $FRONTEND_PID 2>/dev/null; then
        echo -e "${BLUE}Stopping React frontend...${NC}"
        kill $FRONTEND_PID
    fi
    
    echo -e "${GREEN}Applications stopped successfully.${NC}"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM EXIT

echo -e "\n${GREEN}✅ Finance Search Application is starting up!${NC}"
echo -e "${GREEN}📊 Finance API: http://localhost:5001/api/health${NC}"
echo -e "${GREEN}🌐 React Frontend: http://localhost:3000${NC}"
echo -e "\n${YELLOW}Press Ctrl+C to stop both applications${NC}\n"

# Wait for background processes
wait