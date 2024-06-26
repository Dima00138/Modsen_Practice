-- CreateTable
CREATE TABLE "UserMeetup" (
    "userId" INTEGER NOT NULL,
    "meetupId" INTEGER NOT NULL,

    CONSTRAINT "UserMeetup_pkey" PRIMARY KEY ("userId","meetupId")
);

-- AddForeignKey
ALTER TABLE "UserMeetup" ADD CONSTRAINT "UserMeetup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMeetup" ADD CONSTRAINT "UserMeetup_meetupId_fkey" FOREIGN KEY ("meetupId") REFERENCES "Meetup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
