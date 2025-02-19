package web.hub.audio.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import web.hub.audio.service.CommandLauncherStream;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.List;

import org.apache.commons.io.IOUtils;

import java.util.concurrent.*;

@Service
public class CommandLauncherStreamPiped implements CommandLauncherStream {
    private static final Logger LOGGER = LoggerFactory.getLogger(CommandLauncherStreamPiped.class);

    @Value("${hub-audio-service.audio-encoding.process-timeout-seconds}")
    private int processTimeoutSeconds;

    private Executor executor;

    @Autowired
    public CommandLauncherStreamPiped(@Qualifier("taskExecutor") Executor executor) {
        this.executor = executor;
    }

    private class ProcessInputWriter implements Runnable {
        private final InputStream inputStream;
        private final OutputStream processOutputStream;

        public ProcessInputWriter(InputStream inputStream, OutputStream processOutputStream) {
            this.inputStream = inputStream;
            this.processOutputStream = processOutputStream;
        }

        @Override
        public void run() {
            LOGGER.info("ProcessInputWriter thread started work");
            try {
                IOUtils.copy(inputStream, processOutputStream);
            } catch (IOException ex) {
                LOGGER.info("IOException occurred: {}", ex.getMessage());
            }

            IOUtils.closeQuietly(inputStream);
            IOUtils.closeQuietly(processOutputStream);
            LOGGER.info("ProcessInputWriter thread finished work");
        }
    }

    public InputStream executeStream(List<String> commandToExec, InputStream inputStream) {

        if (inputStream != null) {
            try {
                ProcessBuilder processBuilder = new ProcessBuilder(commandToExec);
                Process process = processBuilder.start();
                LOGGER.info("Started execution process");

                ProcessInputWriter processInputWriter = new ProcessInputWriter(inputStream, process.getOutputStream());

                CompletableFuture.runAsync(processInputWriter, executor)
                        .orTimeout(processTimeoutSeconds, TimeUnit.SECONDS)
                        .exceptionally(ex -> {
                            if (ex instanceof TimeoutException){
                                LOGGER.error("Terminating ProcessInputWriter thread and process by timeout of {} seconds", processTimeoutSeconds);
                            }else{
                                LOGGER.error("Terminating ProcessInputWriter thread and process by error", ex);
                            }
                            process.destroy();
                            return null;
                        });

                LOGGER.info("Finishing execution process");
                return process.getInputStream();
            } catch (IOException e) {
                throw new RuntimeException("IOException in piped process execution: " + e.getMessage());
            }
        } else {
            return inputStream;
        }
    }
}