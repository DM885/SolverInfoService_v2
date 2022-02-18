#------------------------------------------------------------------------------#
# This file contains the setup for building a base image for the MiniZinc
# challenges. It uses multi-stage builds in order to keep the images small.
# Note that the statements ADD, RUN, and COPY can add image layers.
#------------------------------------------------------------------------------#
# The build image

# Setup Alpine Linux as build image
FROM alpine:latest AS builder

#------------------------------------------------------------------------------#
# Script for executing a FlatZinc or MiniZinc solver in the FD class

RUN mkdir /minizinc


#------------------------------------------------------------------------------#
# Setup of the base image

# Get base image from the latest Ubuntu LTS
FROM minizinc/minizinc:2.5.5

# Copy unpacked MiniZinc installation from the build image
COPY --from=builder /minizinc /minizinc
COPY --from=builder /.minizinc /root/.minizinc

# Create folder for the solver submission, link solver MiniZinc library,
# remove bundled solver configuration files
RUN mkdir /entry_data \
    && mkdir /entry_data/mzn-lib \
    && ln -s /entry_data/mzn-lib /usr/local/share/minizinc/exec \
    && rm /usr/local/share/minizinc/solvers/*.msc

#------------------------------------------------------------------------------#
# Environment Variables

# Add FlatZinc solver absolute path
ENV FZNEXEC="/entry_data/fzn-exec"

# Add MiniZinc's binary path to PATH
ENV PATH="/minizinc:${PATH}"

#------------------------------------------------------------------------------#
# Setup Working Directory

WORKDIR /minizinc


COPY package*.json ./

# If you are building your code for production
RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 8080
CMD ["npm", "run", "start"]
