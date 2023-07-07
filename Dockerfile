FROM python:3.11.4

SHELL ["/bin/bash", "-c"]

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN pip install --upgrade pip

RUN apt update && apt -qy install gcc libjpeg-dev libxslt-dev \
    libpq-dev libmariadb-dev libmariadb-dev-compat gettext cron openssh-client flake8 locales vim

RUN useradd -rms /bin/bash ir && chmod 777 /opt /run

WORKDIR /app

RUN mkdir /app/static && mkdir /app/media && chown -R ir:ir /app && chmod 755 /app

COPY --chown=ir:ir . .

RUN pip install -r requirements.txt

USER ir

CMD ["gunicorn","-b","0.0.0.0:8000","somestore.wsgi:application"]
