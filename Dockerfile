FROM node
EXPOSE 8080
COPY ./src/ /
RUN ls -laR src/
RUN npm install 
CMD ["npm", "run", "start"]
