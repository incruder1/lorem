import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { filters, companyName } from "../redux_store/slices/jobsApiSlice";
import {
  fetchJobs,
  selectHasMore,
  selectJobs,
  selectLoading,
  selectIsInitialCall,
  selectOffset,
  changeOffset,
} from "../redux_store/slices/infiniteScrollerSlice";
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Typography,
  Link,
  Avatar,
  CircularProgress,
  Paper,
} from "@mui/material";
import {
  companyNameStyle,
  jobRoleStyle,
  salaryStyle,
  jobLocationStyle,
  cardStyle,
  cardPaperStyle,
  cardHeaderBox,
  cardContentStyle,
  cardContentText,
  cardActionStyle,
  experienceTextStyle,
  easyApplyBtn,
  refferalBtn,
  daysStyle,
  avatarStyle,
  spinnerStyle,
  matchNotFound,
} from "../styles/jobCardStyles";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import Profile1 from "../assets/pp1.jpg";
import Profile2 from "../assets/pp2.jpg";
import hourglass from "../assets/hourGlassIMG.svg";
import JobDialogueBox from "./JobDialogueBox";

const JobCards = () => {
  // referall button static images
  const referralImages = [
    {
      name: "referal person 1",
      img: Profile1,
    },
    {
      name: "referal person 2",
      img: Profile2,
    },
  ];

  const dispatch = useDispatch();

  const fetchedJobs = useSelector(selectJobs);
  const isLoading = useSelector(selectLoading);
  const offset = useSelector(selectOffset);
  const isInitialCall = useSelector(selectIsInitialCall);
  const hasMore = useSelector(selectHasMore);
  const selectedfilters = useSelector(filters);
  const selectedCompany = useSelector(companyName);

  // ref for intersection observer
  const loadingRef = useRef(null);

  const [loadedJobs, setLoadedJobs] = useState({});
  const [filteredJobs, setFilteredJobs] = useState([]);

  //function to add smooth animation to new data coming from api.
  const handleImageLoad = (index) => {
    setLoadedJobs((prev) => ({ ...prev, [index]: true }));
  };

  // hook to call the api
  useEffect(() => {
    if (hasMore) {
      dispatch(fetchJobs({ offset: offset, limit: 10 }));
    }
  }, [hasMore, offset, dispatch]);

  // intersection observer for infinte scrolling
  useEffect(() => {
    if (!loadingRef.current) return;

    const loading = loadingRef.current;
    const loadingObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInitialCall) {
          dispatch(changeOffset());
        }
      },
      {
        threshold: 1,
      }
    );

    loadingObserver.observe(loading);
    return () => {
      if (loading) loadingObserver.unobserve(loading);
    };
  }, [fetchedJobs]);

  //function to handle null calues for salary
  const handleSalaryNull = (minSalary, maxSalary, currency) => {
    if (minSalary === null && maxSalary === null) {
      return "Not Specified";
    } else if (minSalary === null) {
      return `${currency} ${maxSalary} LPA`;
    } else if (maxSalary === null) {
      return `${currency} ${minSalary} LPA`;
    } else {
      return `${currency} ${minSalary} - ${maxSalary} LPA`;
    }
  };

  // Convert selectedfilters.location to lowercase
  const lowerCaseLocation =
    selectedfilters.location &&
    selectedfilters.location.map((location) => location.toLowerCase());

  const min_base_salary =
    selectedfilters.min_base_salary &&
    parseInt(selectedfilters.min_base_salary.slice(0, -1));

  // Create a new object to store the converted filters
  const filtersLowerCase = {
    ...selectedfilters,
    location: lowerCaseLocation,
    min_base_salary: min_base_salary,
  };

  useEffect(() => {
    // Filter the fetchedJobs based on selected filters
    const filteredData =
      !isLoading &&
      fetchedJobs &&
      fetchedJobs.filter((job) => {
        if (Object.keys(selectedfilters).length > 0) {
          if (
            filtersLowerCase.min_experience !== null &&
            job.minExp < parseInt(selectedfilters.min_experience)
          ) {
            return false;
          }

          if (
            filtersLowerCase.role &&
            filtersLowerCase.role.length > 0 &&
            !filtersLowerCase.role.some((each) => each.value === job.jobRole)
          ) {
            return false;
          }

          if (
            filtersLowerCase.location &&
            filtersLowerCase.location.length > 0 &&
            !filtersLowerCase.location.includes(job.location)
          ) {
            return false;
          }

          if (
            filtersLowerCase.min_base_salary &&
            filtersLowerCase.min_base_salary !== null &&
            job.minJdSalary < filtersLowerCase.min_base_salary
          ) {
            return false;
          }

          return true;
        }

        // Filter the fetchedJobs based on selected company
        if (
          !job.companyName.toLowerCase().includes(selectedCompany.toLowerCase())
        ) {
          return false;
        }

        return true;
      });
    setFilteredJobs(filteredData);
  }, [fetchedJobs, selectedfilters, selectedCompany]);

  return (
    <Box>
      {!hasMore && filteredJobs && filteredJobs.length === 0 && (
        <Box sx={matchNotFound}>
          <Typography>No match found</Typography>
        </Box>
      )}
      <Grid container columnSpacing={7} rowSpacing={5}>
        {filteredJobs &&
          filteredJobs.map((job, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              lg={4}
              key={index}
              sx={
                loadedJobs[index]
                  ? { transition: "opacity 0.3s ease-in-out" }
                  : { opacity: 0 }
              }
              onLoad={() => handleImageLoad(index)}
            >
              <Card className="card-animation" elevation={3} sx={cardStyle}>
                <Paper sx={cardPaperStyle}>
                  <Box>
                    <img
                      height={15}
                      width={15}
                      src={hourglass}
                      alt="hour glass"
                    />
                  </Box>
                  <Typography sx={daysStyle}>Posted 10 days ago</Typography>
                </Paper>

                <Box sx={cardHeaderBox}>
                  <img
                    width={35}
                    height={35}
                    src={job.logoUrl}
                    alt={`${job.companyName} logo`}
                  />
                  <Box>
                    <Typography style={companyNameStyle} variant="h6">
                      {job.companyName}
                    </Typography>
                    <Typography
                      className="job-role"
                      style={jobRoleStyle}
                      variant="h6"
                    >
                      {job.jobRole}
                    </Typography>
                    <Typography
                      style={jobLocationStyle}
                      className="job-location"
                      variant="h6"
                    >
                      {job.location}
                    </Typography>
                  </Box>
                </Box>
                <Typography style={salaryStyle}>
                  Estimated Salary:{" "}
                  {handleSalaryNull(
                    job.minJdSalary,
                    job.maxJdSalary,
                    job.salaryCurrencyCode
                  )}
                  <CheckBoxIcon color="success" />
                </Typography>
                <CardContent sx={cardContentStyle}>
                  <Typography sx={cardContentText} varinat="h6">
                    About Company:
                  </Typography>
                  <Typography sx={cardContentText} varinat="body1">
                    {job.jobDetailsFromCompany}
                  </Typography>
                </CardContent>
                <JobDialogueBox
                  jobDescription={job.jobDetailsFromCompany}
                  jdLink={job.jdLink}
                />
                <CardActions sx={cardActionStyle}>
                  <Box sx={{ margin: "15px 0" }}>
                    <Typography sx={experienceTextStyle}>
                      Minimum Experience: <br />
                      <span style={{ color: "black" }}>
                        {job.minExp === null
                          ? "Not Specified"
                          : `${job.minExp} years`}
                      </span>
                    </Typography>
                  </Box>
                  <Link
                    href={job.jdLink}
                    target="_blank"
                    underline="none"
                    sx={{ width: "100%" }}
                  >
                    <Button fullWidth variant="contained" sx={easyApplyBtn}>
                      <ElectricBoltIcon style={{ color: "yellow" }} /> Easy
                      Apply
                    </Button>
                  </Link>
                  <Button fullWidth variant="contained" sx={refferalBtn}>
                    {referralImages.map((referralImage, index) => (
                      <Avatar
                        sx={avatarStyle}
                        key={index}
                        alt={referralImage.name}
                        src={referralImage.img}
                      />
                    ))}
                    Unlock referal asks
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
      </Grid>
      {hasMore && (
        <Box ref={loadingRef} sx={spinnerStyle}>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default JobCards;
