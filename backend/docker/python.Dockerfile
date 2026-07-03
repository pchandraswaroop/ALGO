FROM python:3.10-slim

RUN useradd --create-home --shell /bin/sh judge

WORKDIR /workspace
USER judge
