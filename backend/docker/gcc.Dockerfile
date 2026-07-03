FROM gcc:13

RUN useradd --create-home --shell /bin/sh judge

WORKDIR /workspace
USER judge
