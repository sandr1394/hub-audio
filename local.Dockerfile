FROM docker.prosper.com/spring-boot-base-2:1.1.0 as release

RUN apk update \
  && apk add ffmpeg

EXPOSE 9095
COPY web-hub-audio-service/build/libs/*.jar ./
ENTRYPOINT java -Dspring.profiles.active=qa32 -jar ./*.jar
RUN rm *sources.jar
