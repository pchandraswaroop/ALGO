FROM node:18-slim

RUN useradd --create-home --shell /bin/sh judge

WORKDIR /workspace
USER judge
