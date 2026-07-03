FROM eclipse-temurin:17-jdk

RUN useradd --create-home --shell /bin/sh judge

WORKDIR /workspace
USER judge
