# This is a multi-stage build. First, copy the source into an image and build
FROM docker.prosper.com/spring-boot-base-2:1.1.0 as build

#Get node
RUN apk update \
  && apk add nodejs npm

# Set the working directory for subsequent Dockerfile commands to execute from
WORKDIR /source

# Install Yarn
RUN npm install --global yarn

# Copy the entire source tree into the container
COPY . .
# For the few that develop on Windows - convert the line endings to Unix format on the gradle script
RUN find . -type f -print0 | xargs -0 dos2unix

# Clear previous static content
RUN rm -rf ./web-hub-audio-service/src/main/resources/static/*

# Build frontend to static folder
RUN yarn && yarn build

# Build the project! //todo include https://confluence.prosper.com/display/SPB/Migrating+a+spring-boot-base+service+to+Gradle+6
RUN chmod +x ./gradlew && ./gradlew build ;
# Delete the sources jar generated for the service jar. It's unnecessary and if kept around the COPY command later
# will copy it into the image and it'll cause a conflict with the entrypoint script that launches the service
RUN rm -rf ./web-hub-audio-service/build/libs/*-sources.jar

# Now in stage two, we'll build the image we'll actually deploy, using the output of the build image above
FROM docker.prosper.com/spring-boot-base-2:1.1.0 as release
# The port you wish to expose out of the container - it should match the port of the service
EXPOSE 8352

RUN apk update \
  && apk add ffmpeg

# Copy the application jar from the build image to where the spring-boot-base-2 image expects it, $APP_HOME
COPY --from=build /source/web-hub-audio-service/build/libs/*.jar ${APP_HOME}/

#this is for setting the active profile for local docker builds, note that the CICD pipline will override entrypoint with the ENTRYPOINT comand using entrypoint.sh from the base dockerfile
ENTRYPOINT java -Dspring.profiles.active=qa32 -jar ${APP_HOME}/*.jar

#####################################################################################################
#
# 1. To build an image:
#    docker build -t web-hub-audio .
# 2. To run the image as a container:
#    docker run -d -p 8353:8353 --name web-hub-audio-container web-hub-audio
# 3. To stop the container
#    docker stop web-hub-audio-container
#####################################################################################################
